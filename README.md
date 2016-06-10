# ![CF](http://i.imgur.com/7v5ASc8.png) tai
a tool for managing student assignment repos

## demo
### setup
**config** - to configure tai
```
tai config <github_organization> <github_token>
```

**team** - to set teams
```
tai team <json_filepath>
```
json file:
```
[ "tad-and-anki", "plz-and-respond" ]
```
teams must be valid branch names

### run
**setup** - to create unique branch for each team and set up travis
```
tai setup <repo_name>
```

**close** - to merge team branches into unique folders in master
```
tai close <repo_name>
```
