## How To Add A New Page

1. Update CeraonPage enum in ./CeraonPage.ts
2. Add state for the page here
3. Add state to the CeraonState object in CeraonState.ts
4. Update mappings for url and title in ../Utils/CeraonPageUtils.ts
5. If necessary, update UrlProvider (../../Services/UrlProvider.ts) w/ appropriate Url generation method
6. Update History Service router (../../Services/HistoryService.ts) to handle navigation to the page