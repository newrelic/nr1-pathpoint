## Release notes
### Version 1.5.4 <br>
## What’s new  <br>
- ***KPIs are no longer required***<br>
Description: It's possible to leave the kpi array empty in the JSON configuration file. It will hide the KPI banner <br>
- ***Implement New Congestion Algorithm*** <br>
Description: Congestion is caused by Values over Max value set in tuning  <br>
Total Congestion Value: sum of all values that are above max set value <br>
Total Count Value: sum of all touchpoints values <br>
Congestion Percentage = 100 multiplied by the total congestion Value divided by the total count value <br>
- ***Ability to manage JSON version in NR1 Platform*** <br>
Description: Loading the old config into NerdStore with a key like pathpoint_config_[datetime_archived]Intro to NerdStorage UserStorageQuery Then in the UI we can provide a config history option that shows the versions. <br>
- ***History tracking and version control for JSON config***<br>
Description: It's possible to keep track of previous congis updates and restore them. It can also be visualized the description, note, date and user that updated the file in the history section  <br>
- ***Implementation of Background Service for Drop Filter***<br>
Description: Drop filter active shows the amount of drops per stage with their values equivalents previously set in the tunning. It also shows the steps causing drops.  <br>
## Resolved issues 
- ***Autofit Logo Image*** <br>
Description: Setting logo aspect ratio 3:1 <br>
- ***Default Pathpoint logo*** <br>
Description: New logo has been set <br>
## Known issues 
- ***No changes*** <br>
## Documentation changes 
- ***New congestion algorithm*** <br>
Read me file here <br>
- ***Drop filter implementation*** <br>
Read me file here <br>