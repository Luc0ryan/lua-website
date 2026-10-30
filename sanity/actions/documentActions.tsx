import { useCallback, useState } from "react";
import { useRouter } from "sanity/router";
import { useClient, type DocumentActionComponent } from "sanity";
import { Box, Button, Card, Flex, Radio, Stack, Text, useToast } from "@sanity/ui";

const API_VERSION = "2024-01-01";

// "+ Add location" — appended to the `project` document type's action list.
// Opens a new `location` document with `project` pre-filled via the
// `location-for-project` initial value template (registered in sanity.config.ts).
export const AddLocationAction: DocumentActionComponent = (props) => {
  const router = useRouter();
  return {
    label: "Add location",
    onHandle: () => {
      router.navigateIntent("create", {
        type: "location",
        template: "location-for-project",
        projectId: props.id,
      });
    },
  };
};

// Wraps the built-in `publish` action for `location` documents: if the
// document being published has locationState "current", any other `current`
// location for the same project is patched to "past" first. Patches target
// the sibling's PUBLISHED document directly (not its draft) since this is a
// side effect on OTHER documents, not the one going through this action's
// own draft → publish flow.
export function wrapPublishForLocationAutoSwap(
  originalPublish: DocumentActionComponent
): DocumentActionComponent {
  const AutoSwapPublish: DocumentActionComponent = (props) => {
    const client = useClient({ apiVersion: API_VERSION });
    const toast = useToast();
    const [isSwapping, setIsSwapping] = useState(false);
    const original = originalPublish(props);

    const locationState = (props.draft?.locationState ?? props.published?.locationState) as
      | string
      | undefined;
    const project = (props.draft?.project ?? props.published?.project) as
      | { _ref?: string }
      | undefined;

    if (!original || locationState !== "current" || !project?._ref) {
      return original;
    }

    return {
      ...original,
      disabled: original.disabled || isSwapping,
      onHandle: async () => {
        setIsSwapping(true);
        try {
          const siblingIds: string[] = await client.fetch(
            `*[_type == "location" && !(_id in path("drafts.**")) && project._ref == $projectId && locationState == "current" && _id != $selfId]._id`,
            { projectId: project._ref, selfId: props.id }
          );
          if (siblingIds.length > 0) {
            const tx = client.transaction();
            for (const id of siblingIds) {
              tx.patch(id, (p) => p.set({ locationState: "past" }));
            }
            await tx.commit();
          }
        } catch (err) {
          // Don't publish if the swap failed — two "current" stops would
          // show the project in two places on the map.
          toast.push({
            status: "error",
            title: "Couldn't update this project's other locations",
            description: err instanceof Error ? err.message : "Please try publishing again.",
          });
          return;
        } finally {
          setIsSwapping(false);
        }
        original.onHandle?.();
      },
    };
  };
  AutoSwapPublish.action = "publish";
  return AutoSwapPublish;
}

// Wraps the built-in `publish` action for `project` documents: the slug
// field has no `required()` validation (so it stays quiet while the editor
// is still filling out the title), but publishing without one would break
// the project page URL. This blocks the actual publish attempt and surfaces
// a toast instead, so the error only appears when it's actually relevant.
export function wrapPublishForRequiredSlug(
  originalPublish: DocumentActionComponent
): DocumentActionComponent {
  const RequireSlugPublish: DocumentActionComponent = (props) => {
    const toast = useToast();
    const original = originalPublish(props);
    const slug = (props.draft?.slug ?? props.published?.slug) as { current?: string } | undefined;

    if (!original || slug?.current) {
      return original;
    }

    return {
      ...original,
      onHandle: () => {
        toast.push({
          status: "error",
          title: "Add a slug before publishing",
          description: "The Slug field under Core is required to generate the project page URL.",
        });
      },
    };
  };
  RequireSlugPublish.action = "publish";
  return RequireSlugPublish;
}

// "Resolve to permanent" — appended to the `project` document type's action
// list. Lets the editor pick any location (current or past) as the
// project's permanent site: that one becomes `current`, every other location
// for the project becomes `past`, and the project's `placement` is set to
// "permanent". Patches target PUBLISHED documents directly, same rationale
// as the auto-swap action above.
type LocationSummary = { _id: string; title: string; locationState: "current" | "past" };

function ResolveToPermanentDialog({
  locations,
  selectedId,
  onSelect,
  onConfirm,
  onCancel,
  isResolving,
}: {
  locations: LocationSummary[] | null;
  selectedId: string | null;
  onSelect: (id: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
  isResolving: boolean;
}) {
  return (
    <Box padding={4}>
      {!locations ? (
        <Text muted size={1}>
          Loading locations…
        </Text>
      ) : locations.length === 0 ? (
        <Text muted size={1}>
          This project has no locations yet.
        </Text>
      ) : (
        <Stack space={3}>
          <Text size={1} muted>
            Pick the location that becomes this project&apos;s permanent site. All others will be
            marked Past.
          </Text>
          <Card as="fieldset" border radius={2} padding={3}>
            <Stack space={3}>
              {locations.map((loc) => (
                <Flex as="label" key={loc._id} align="center" gap={3}>
                  <Radio
                    name="resolve-location"
                    checked={selectedId === loc._id}
                    onChange={() => onSelect(loc._id)}
                  />
                  <Text size={1}>
                    {loc.title} · {loc.locationState}
                  </Text>
                </Flex>
              ))}
            </Stack>
          </Card>
          <Flex justify="flex-end" gap={2}>
            <Button mode="ghost" text="Cancel" onClick={onCancel} disabled={isResolving} />
            <Button
              tone="positive"
              text="Resolve to permanent"
              onClick={onConfirm}
              disabled={isResolving || !selectedId}
            />
          </Flex>
        </Stack>
      )}
    </Box>
  );
}

export const ResolveToPermanentAction: DocumentActionComponent = (props) => {
  const client = useClient({ apiVersion: API_VERSION });
  const toast = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [locations, setLocations] = useState<LocationSummary[] | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isResolving, setIsResolving] = useState(false);

  const openDialog = useCallback(() => {
    setDialogOpen(true);
    setLocations(null);
    client
      .fetch<LocationSummary[]>(
        `*[_type == "location" && !(_id in path("drafts.**")) && project._ref == $projectId]{
          _id, locationState, "title": coalesce(venueName, city, "Untitled location")
        } | order(locationState asc)`,
        { projectId: props.id }
      )
      .then((results) => {
        setLocations(results);
        setSelectedId(results.find((l) => l.locationState === "current")?._id ?? results[0]?._id ?? null);
      })
      .catch(() => {
        setDialogOpen(false);
        toast.push({ status: "error", title: "Couldn't load this project's locations" });
      });
  }, [client, props.id, toast]);

  const confirm = useCallback(async () => {
    if (!selectedId || !locations) return;
    setIsResolving(true);
    try {
      const tx = client.transaction();
      for (const loc of locations) {
        tx.patch(loc._id, (p) => p.set({ locationState: loc._id === selectedId ? "current" : "past" }));
      }
      // Patch the published project AND any open draft. Patching only the
      // published copy let a later publish of the draft put the old
      // placement back.
      if (props.published) tx.patch(props.id, (p) => p.set({ placement: "permanent" }));
      if (props.draft) tx.patch(`drafts.${props.id}`, (p) => p.set({ placement: "permanent" }));
      await tx.commit();
      setDialogOpen(false);
      toast.push({ status: "success", title: "Resolved to permanent" });
    } catch (err) {
      toast.push({
        status: "error",
        title: "Couldn't resolve to permanent",
        description: err instanceof Error ? err.message : "Nothing was changed. Please try again.",
      });
    } finally {
      setIsResolving(false);
    }
  }, [client, locations, selectedId, props.id, props.published, props.draft, toast]);

  return {
    label: "Resolve to permanent",
    onHandle: openDialog,
    dialog: dialogOpen && {
      type: "dialog",
      onClose: () => setDialogOpen(false),
      header: "Resolve to permanent",
      content: (
        <ResolveToPermanentDialog
          locations={locations}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onConfirm={confirm}
          onCancel={() => setDialogOpen(false)}
          isResolving={isResolving}
        />
      ),
    },
  };
};
