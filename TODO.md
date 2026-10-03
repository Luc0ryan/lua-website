# TODO

## Near launch
- [ ] Add webhooks to track where potential LUA clients end up landing on "Contact Us" from — i.e. which page/section they came from before converting.
- [ ] Delete `app/components/_archive/` folder (unused hero/section variants, see CLEANUP.md)

## Map handoff (after client sign-off on `/map/demo`)
- [ ] Create the client's own Google account/Cloud project (use their email), enable billing, and generate a new Maps API key.
- [ ] Restrict that key: HTTP referrers = Studio origin (`https://<domain>/studio/*`) + `http://localhost:3000/*`; APIs = Maps JavaScript, Places, Geocoding only.
- [ ] Swap `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` in `.env.local` and the Vercel env vars; then delete/disable the old key in the original Cloud project.
- [ ] Geocode real `location` docs in Studio (pin each one) so `/map` shows real data. Until then, `defined(geopoint)` hides them.
- [ ] Delete the demo: `app/(main)/map/demo/` and unset `MAP_DEMO` on Vercel.
