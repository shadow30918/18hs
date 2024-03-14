<?php
/*
* Function 說明
**************************************************
* Input : type('d'|'m'), data(json)
* Output : ok (-3=非活動期間; -2=有資料未填; -1=有格式錯誤; 0=機票號己經登錄過; 1=新增)
* Output : field (ok=-2 & -1 才有, 有問題的欄位)
* Output : img (ok=1, 中獎圖)
**************************************************
*/
ini_set('memory_limit', '-1');

header("Content-Type:text/html; charset=utf-8");

include_once 'db.inc.php';
include_once 'class/common.class.php';

//PHP錯誤顯示設定
ini_set("display_errors", "On"); // 顯示錯誤是否打開( On=開, Off=關 )
error_reporting(E_ALL & ~E_NOTICE);

//設定時區 並 取得目前時間
date_default_timezone_set("Asia/Taipei");
$nowDateTime = date('Y-m-d H:i:s');
$nowDate = date('Y-m-d');

//class init
$common=new Common();

//format
$mobileFormat="/(^09[0-9]{8})/";		//Mobile
$zipFormat="/[0-9]{3,5}/";            //Zip Code
$emailFormat="/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/";	//Email
$ticketFormat="/(^803[0-9]{10})/";

$json=null;


//***** Define information -- 開放抽獎時間10/23 10:00至10/31 17:00
$startDate = "2018-12-28 00:00:00";	//正式為2019-??-?? 00:00:00
$endDate = "2019-03-31 23:59:59"; //***本日仍在活動中

if (strcmp($_SERVER['HTTP_HOST'],"www.catchd.net")==0) {	//只接受本機傳送資料
   if (isset($_POST['func']) && isset($_POST['data'])) {
   	$func=trim($_POST['func']);
      $data=(array)$_POST['data'];

      $check_status=1;  //必填及格式檢查結果 (1=通過, 0=有問題)
      $fields=array();

      if (strcmp($func,"submit")==0) {
         //檢查是否在活動期間
         if (strtotime($startDate) > strtotime($nowDateTime)) {		//活動未開始
            $check_status=0;
         } else if (strtotime($nowDateTime) > strtotime($endDate)) {	//活動截止
            $check_status=0;
         }


         if ($check_status==0) { //不在活動期間
            $json=array('ok'=>-3,'S'=>$startDate, 'startdate'=>strtotime($startDate),'N'=>$nowDateTime,'now'=>strtotime($nowDateTime));
         } else {
            //檢查必填欄位是否有填
            foreach($data as $key=>$value) {
               $data[$key]=trim($value);
               //if (strcmp($key,'u_owner')!=0) { //機票持有人不檢查
                  if (strlen($data[$key])==0) {
                     array_push($fields,$key);
                     $check_status=0;
                  }
               //}
            }


            if ($check_status==0) {  //有空值
            $json=array('ok'=>-2, 'fields'=>$fields);
         } else {
            //格式檢查
            if (!preg_match($mobileFormat, $data['u_mobile'])) {
					array_push($fields, 'u_mobile');
               $check_status=0;
				}
            if (!preg_match($zipFormat, $data['u_zip'])) {
					array_push($fields, 'u_zip');
               $check_status=0;
				}
            if (!preg_match($ticketFormat, $data['u_ticket'])) {
					array_push($fields, 'u_ticket');
               $check_status=0;
				}

            if ($check_status==0) {  //格式有錯
               $json=array('ok'=>-1, 'fields'=>$fields);
            } else {
               $db=new Database();

               //檢查機號有沒有重覆
               $db->query('SELECT u_no FROM Mandarin_201812_User WHERE u_ticket=:u_ticket');
               $db->bind(':u_ticket', $data['u_ticket']);
               $rows = $db->resultset();

               if ($db->rowCount()>0) {
                  $check_status=0;
               }

               if ($check_status==0) { //找到資料
                  $json=array('ok'=>0);
               } else {
                  //新增參加者資料
                  $db->query("INSERT INTO Mandarin_201812_User(u_name,u_mobile,u_zip,u_addr,u_ticket,u_ip,u_c_date) VALUES(:u_name,:u_mobile,:u_zip,:u_addr,:u_ticket,:u_ip,:u_c_date)");

                  $db->bind(':u_name', $data['u_name']);
                  $db->bind(':u_mobile', $data['u_mobile']);
                  $db->bind(':u_zip', $data['u_zip']);
                  $db->bind(':u_addr', $data['u_addr']);
                  $db->bind(':u_ticket', $data['u_ticket']);
                  $db->bind(':u_ip', getIP());
                  $db->bind(':u_c_date', $nowDateTime);

                  $db->execute();

                  $json=array('ok'=>1);
               }
            }
         }
      }
         echo json_encode($json);
      }
   }
}


function getIP() {
  foreach (array('HTTP_CLIENT_IP', 'HTTP_X_FORWARDED_FOR', 'HTTP_X_FORWARDED', 'HTTP_X_CLUSTER_CLIENT_IP', 'HTTP_FORWARDED_FOR', 'HTTP_FORWARDED', 'REMOTE_ADDR') as $key) {
    if (array_key_exists($key, $_SERVER) === true) {
        foreach (explode(',', $_SERVER[$key]) as $ip) {
           if (filter_var($ip, FILTER_VALIDATE_IP) !== false) {
              return $ip;
           }
        }
     }
   }
 }
?>
