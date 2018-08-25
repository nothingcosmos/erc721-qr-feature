#!/bin/bash

curl -X GET "https://api-sandbox.cloudsign.jp/token?client_id=97a3e2b6-fce4-400b-8094-3d4b178e6aa6" -H "accept: application/json"

# -H "Authorization: Bearer 4c59ab2e-b34b-4985-893a-afce2b07f503"

# 一覧取得
curl -X GET "https://api-sandbox.cloudsign.jp/documents" -H "accept: application/json" -H "Authorization: Bearer 97c79228-8265-4a16-aadf-9788c69a2d10"

# 上記のidを指定して詳細取得
curl -X GET "https://api-sandbox.cloudsign.jp/documents/2bd1d014-04af-4b30-963d-4dd5e2bf739b" -H "accept: application/json" -H "Authorization: Bearer 97c79228-8265-4a16-aadf-9788c69a2d10"

# 送信
POST /documents/{documentID}

5.2. 入力項目が設置されているテンプレートを呼び出して相手に送付する場合
アクセストークンの取得 : GET /token
書類の作成 : POST /documents （template_id に既存テンプレートの ID を指定して呼び出し）

curl -X POST "https://api-sandbox.cloudsign.jp/documents" -H "accept: application/json" -H "Authorization: Bearer 97c79228-8265-4a16-aadf-9788c69a2d10" -H "Content-Type: application/x-www-form-urlencoded" -d "title=testDocument&note=test&message=%E7%A2%BA%E8%AA%8D%E4%BE%9D%E9%A0%BC%E3%83%A1%E3%83%BC%E3%83%AB%E3%81%AB%E8%BF%BD%E5%8A%A0%E3%81%95%E3%82%8C%E3%82%8B%E3%83%86%E3%82%B9%E3%83%88%E3%83%A1%E3%83%83%E3%82%BB%E3%83%BC%E3%82%B8&template_id=2bd1d014-04af-4b30-963d-4dd5e2bf739b&can_transfer=false"


{"id":"30fb34fa-52b5-4e9a-97bb-e08bb3764697","user_id":"408a562c-ca4c-46a5-aa16-5b0127317d0f","title":"testDocument","note":"test","message":"確認依頼メールに追加されるテストメッセージ","status":0,"can_transfer":false,"created_at":"2018-08-25T12:37:34.000851744+09:00","updated_at":"2018-08-25T12:37:34.218507167+09:00","participants":[{"id":"5102b63c-4c7c-484d-a664-55e30221ba2d","email":"nothingcosmos@gmail.com","name":"坂頂佑樹","organization":"","order":0,"status":2,"language_code":"ja"},{"id":"b481d385-d6c4-4f1b-91aa-7db5f710efe2","email":"_1","name":"","organization":"","order":1,"status":0,"language_code":"ja"}],"files":[{"id":"63c0012e-6e50-44c0-8338-48b0e2c7bcf9","name":"20180820_レンタルサービス利用規約.pdf","order":0,"total_pages":4,"widgets":[{"id":"e7465ef5-0ccb-4bba-a7b0-900e08d1681c","widget_type":1,"participant_id":"b481d385-d6c4-4f1b-91aa-7db5f710efe2","file_id":"63c0012e-6e50-44c0-8338-48b0e2c7bcf9","page":3,"x":46,"y":581,"w":206,"h":41,"text":"","status":0}]}]}

cloneのたびにparticipateは振り直されるので要注意


宛先の変更 : PUT /documents/{documentID}/participants/{participantID} （email, name は必須となります）
curl -X PUT "https://api-sandbox.cloudsign.jp/documents/30fb34fa-52b5-4e9a-97bb-e08bb3764697/participants/b481d385-d6c4-4f1b-91aa-7db5f710efe2" -H "accept: application/json" -H "Authorization: Bearer 97c79228-8265-4a16-aadf-9788c69a2d10" -H "Content-Type: application/x-www-form-urlencoded" -d "email=test%40gmail.com&name=test%40gmail.com"

{"id":"30fb34fa-52b5-4e9a-97bb-e08bb3764697","user_id":"408a562c-ca4c-46a5-aa16-5b0127317d0f","title":"testDocument","note":"test","message":"確認依頼メールに追加されるテストメッセージ","status":0,"can_transfer":false,"created_at":"2018-08-25T03:37:34Z","updated_at":"2018-08-25T03:39:18Z","participants":[{"id":"5102b63c-4c7c-484d-a664-55e30221ba2d","email":"nothingcosmos@gmail.com","name":"坂頂佑樹","organization":"","order":0,"status":2,"language_code":"ja"},{"id":"b481d385-d6c4-4f1b-91aa-7db5f710efe2","email":"test@gmail.com","name":"test@gmail.com","organization":"","order":1,"status":0,"language_code":"ja"}],"files":[{"id":"63c0012e-6e50-44c0-8338-48b0e2c7bcf9","name":"20180820_レンタルサービス利用規約.pdf","order":0,"total_pages":4,"widgets":[{"id":"e7465ef5-0ccb-4bba-a7b0-900e08d1681c","widget_type":1,"participant_id":"b481d385-d6c4-4f1b-91aa-7db5f710efe2","file_id":"63c0012e-6e50-44c0-8338-48b0e2c7bcf9","page":3,"x":46,"y":581,"w":206,"h":41,"text":"","status":0}]}]}

書類の送信 : POST /documents/{documentID}

curl -X POST "https://api-sandbox.cloudsign.jp/documents/30fb34fa-52b5-4e9a-97bb-e08bb3764697" -H "accept: application/json" -H "Authorization: Bearer 97c79228-8265-4a16-aadf-9788c69a2d10"

{"id":"30fb34fa-52b5-4e9a-97bb-e08bb3764697","user_id":"408a562c-ca4c-46a5-aa16-5b0127317d0f","title":"testDocument","note":"test","message":"確認依頼メールに追加されるテストメッセージ","status":1,"can_transfer":false,"created_at":"2018-08-25T03:37:34Z","updated_at":"2018-08-25T03:46:33Z","participants":[{"id":"5102b63c-4c7c-484d-a664-55e30221ba2d","email":"nothingcosmos@gmail.com","name":"坂頂佑樹","organization":"","order":0,"status":6,"language_code":"ja"},{"id":"b481d385-d6c4-4f1b-91aa-7db5f710efe2","email":"nothingcosmos@gmail.com","name":"nothingcosmos@gmail.com","organization":"","order":1,"status":4,"language_code":"ja","access_expires_at":"2018-09-04T03:46:33Z"}],"files":[{"id":"63c0012e-6e50-44c0-8338-48b0e2c7bcf9","name":"20180820_レンタルサービス利用規約.pdf","order":0,"total_pages":4,"widgets":[{"id":"e7465ef5-0ccb-4bba-a7b0-900e08d1681c","widget_type":1,"participant_id":"b481d385-d6c4-4f1b-91aa-7db5f710efe2","file_id":"63c0012e-6e50-44c0-8338-48b0e2c7bcf9","page":3,"x":46,"y":581,"w":206,"h":41,"text":"","status":0}]}]}
