export MONGO_URL="mongodb://localhost:27017/MedBook"

if [ -z "$1" ]; then
    meteor --settings ~/work/sms-sender/settings.json
fi
