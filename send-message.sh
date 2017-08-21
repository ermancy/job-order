curl -H "Content-Type: application/json" \
     -H "Authorization: key=AAAAixcBdNs:APA91bEwqcqPzEQHGyJU59X-E-GPThEy1qW_qvoRgRooStkyUwKMjhnonotbozwXni84oJ6N4RlZ4AoHlhv-ygUm52gIpj0kJzjDcQKd8tK9-rGXnjqrdY4Vw6qVHFZ_c52YPivLQgSB" \
     -d '{
           "notification": {
             "title": "PowerShell - Mesaj Var!",
             "body": "Power! - FriendlyChat",
             "icon": "/images/profile_placeholder.png",
             "click_action": "http://localhost:5000"
           },
           "to": "cY0RTfjPUYs:APA91bH0FxKmGgv8Hg0TflGGm7awTBJNgpOer7OKhmUznUuF5QIh3zK7oXxtyWnv3ovwbGCfXIqaDxXEefrlKFAl2rpxug4chba7Kyh1qcSMA4Wp1q7TckG-_1ZD4Hq-HezMWobCKPgJ"
         }' \
     https://fcm.googleapis.com/fcm/send