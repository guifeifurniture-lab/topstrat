# Agent Activity Auto-Report
Write-Host "Auto-report started"

$dir = "C:\Users\JINDA\.openclaw\workspace-zhugeliang\website"
cd $dir

# Update office state
node api/office-status.js

Write-Host "Done"
