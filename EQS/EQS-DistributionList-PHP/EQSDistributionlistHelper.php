<?php
 class EqsDistList
{
     public $id; //String
     public $name; //String
 }
 class EQSDistributionList
 {
    public $eqs_dist_lists; //array(EqsDistList)
 }
class EQSDistributionListRequest{
    var $access_token;
	var $resultparam;
    function __construct($access_token){
        $this->access_token = $access_token;
    }
    function get_eqsdistributionList()
    {
		$Parameterdata = $_GET['lang'];
		if(	$Parameterdata == "DE" || $Parameterdata == "de"){
			$result = "ss_name";
		}
		else    //($Parameterdata == "FR" || $Parameterdata == "fr" || $Parameterdata == "ENG" || $Parameterdata == "eng"){
			{
				$result = "ss_name". strtolower($_GET['lang']);
		    }
		// else{
		
		// }
	
		if($Parameterdata == "FR" || $Parameterdata == "fr" || $Parameterdata == "ENG" || $Parameterdata == "eng" || $Parameterdata == "de" || $Parameterdata == "DE"){
        $resultparam =  $result;
		$ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, 'https://eqsgroupsandbox.crm4.dynamics.com/api/data/v8.2/ss_eqsdistributionlists?$select'.'='.$result);
        $headers = [
            "Accept: application/json",
            "OData-MaxVersion: 4.0",
            "OData-Version: 4.0",
            "Authorization: Bearer " .$this->access_token
        ];

curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
// Will return the response, if false it print the response
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
// Set the url
curl_setopt($ch, CURLOPT_HTTPHEADER,$headers);
// Execute
$result=curl_exec($ch);
// Closing
curl_close($ch);
// Will dump a beauty json :3
$Jsondata = json_decode($result, true);

if(!isset($Jsondata["value"])){
			echo("Some Error Occured, Data Not Found");
			return;
}
$eqsList =  new EQSDistributionList();
if(sizeof($Jsondata["value"]) > 0){ 
 for ($x = 0; $x < sizeof($Jsondata["value"] ); $x++) {
	 $eqsObj = new EqsDistList();
	  $eqsObj->id = $Jsondata["value"][$x]['ss_eqsdistributionlistid'];
	  $eqsObj->name = $Jsondata["value"][$x][$resultparam];
	  
	  $EQSDistributionArr[] =  $eqsObj;
    }
	 $eqsList->eqs_dist_lists = $EQSDistributionArr;
	echo("<script>console.log('PHP: ".json_encode($eqsList)."');</script>");
	 return $eqsList;
} else{
	echo("No Data Found");
	return;
}
		}else{
			 echo("Please provide the Valid Language");
			 return ;
		}
  }
}
?>