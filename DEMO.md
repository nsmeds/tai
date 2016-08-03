
* config TAI
    * Use `tai` `config`
        * Github Organization and an API token
    * Use `tai` `team` for default branch list (student github accounts)

* For each lab:
    * Create destination branch with `tai` `setup` command
        * Configured with `tai` `team`
        * Or, ad-hoc with `setup` command (pairing teams, etc)
    * Student forks, codes, PR's 
    * Travis runs `npm test`!
    * (Next phase: auto-deployed to heroku)
    * Grade Assignment, commenting in PR
    * Students can resubmit during grading phase, or after
    * Merge PR when grading complete

* Follow-on labs:
    * student codes, PR's
    * (make sure previous PR's are merged)

* Close out:
    * Github does not count commits for heatmap unless:
        * Commits are merged into `master` (or whatever default branch is for repo)
        * Of non-forked repo
    * `tai` `close` merges all student branches into named folder in master