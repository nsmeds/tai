# ![CF](http://i.imgur.com/7v5ASc8.png) tai
a tool for managing student assignment repos

## setup
**tai config** - to configure tai
```
tai config <github_organization> <github_token>
```
**tai org**: show current configuration
```
tai org
```
**tai clear**: remove current organization and Github token
```
tai clear
```

**tai team** - to set teams
```
tai team <json_filepath>
```
json file:
```
[ "tad-and-anki", "plz-and-respond" ]
```
teams must be valid branch names

## run
**tai setup** - to create unique branch for each team and set up travis.  
Optional [branches] flag available to specify a set of branches different from the stored team.  JSON format required.
```
tai setup <repo_name> [branches]
```

**tai close** - to merge team branches into unique folders in master
```
tai close <repo_name>
```
