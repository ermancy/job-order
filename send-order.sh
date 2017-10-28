curl -H "Content-Type: application/json" -H "Authorization: key=AAAAUmG7gzA:APA91bG417E-Wd_7wM3E4XHjCCQHB4I76dPzf4Zs9JvCH5D4fMvt69-3Kac35rkqfIqaamlBzDKQ-Otn4gx2TYRHVW1AUoNugjnB5HW8gCGrgy_HvlNhMTrLj1He8R3JQzdcmMyhbnxr" -d '{
"notification": {
"title": "Job Order message!", 
"body": "There is a new message in Job Order", 
"icon": "/images/profile_placeholder.png", 
"click_action": "https://takip.maymatbaa.com"
}, 
"to": "fTujsYQkCgE:APA91bEx43YUtruKKgec-GcWZIXgsLhZN5lESEAs_OaxbTCS8aoBy8ooDd1CDg9uGYmjMir3fv2PU6RtIZxBISb-NR0jou5OLS3MEkySTlVjI_jX8YnT1pfWTmU311iT5k4jljZvGtyH"
}' https://fcm.googleapis.com/fcm/send