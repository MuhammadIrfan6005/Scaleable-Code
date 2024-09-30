<?php
 class Medium
{
    public $name; //String
    public $id; //String mediumid
}

class Category
{
    public $id; //String
    public $name; //String
    public $media; //array(Medium)
}

class EQSDistributionList
{
    public $id; //String
    public $name; //String
    public $desc; //String
    public $categories; //array(Category)
}


class EQSDistributionListDetailRequest{
    var $access_token;
    function __construct($access_token){
        $this->access_token = $access_token;
    }
    function get_eqsdistributionListDetail()
    {
        $ch = curl_init();
		$listlang = $_GET['lang'];
		if(	$listlang == "DE"){
			$listname = "ss_name";
		}
		else if($listlang == "de"){
			$listname = "ss_name";
		}
		else{
		$listname = "ss_name". strtolower($_GET['lang']);
		}
		$listIDs = $_GET['id'];
		if($listname == 'ss_name'){
			$ListDescribtion = 'ss_description';
		}
		else if($listname == 'ss_nameeng'){
			$ListDescribtion = 'ss_descriptioneng';
		}
		else{
			$ListDescribtion = 'ss_descriptionfr';
		}
		if($listlang == "FR" || $listlang == "fr" || $listlang == "ENG" || $listlang == "eng" || $listlang == "de" || $listlang == "DE"){
		curl_setopt($ch, CURLOPT_URL, 'https://eqsgroupsandbox.crm4.dynamics.com/api/data/v8.2/ss_mediums?fetchXml=%3Cfetch%3E%3Centity%20name%3D%22ss_medium%22%20%3E%3Cattribute%20name%3D%22'.$listname.'%22%20%2F%3E%3Cattribute%20name%3D%22ss_mediumid%22%20%2F%3E%3Cattribute%20name%3D%22ss_category%22%20%2F%3E%3Cattribute%20name%3D%22ss_categoryname%22%20%2F%3E%3Corder%20attribute%3D%22ss_category%22%20%2F%3E%3Clink-entity%20name%3D%22ss_ss_partnerdistributionlist_ss_medium%22%20from%3D%22ss_mediumid%22%20to%3D%22ss_mediumid%22%20intersect%3D%22true%22%20%3E%3Cattribute%20name%3D%22ss_partnerdistributionlistid%22%20%2F%3E%3Clink-entity%20name%3D%22ss_partnerdistributionlist%22%20from%3D%22ss_partnerdistributionlistid%22%20to%3D%22ss_partnerdistributionlistid%22%20%3E%3Clink-entity%20name%3D%22ss_ss_eqsdistributionlist_ss_partnerdistri%22%20from%3D%22ss_partnerdistributionlistid%22%20to%3D%22ss_partnerdistributionlistid%22%20intersect%3D%22true%22%20%3E%3Cfilter%3E%3Ccondition%20attribute%3D%22ss_eqsdistributionlistid%22%20operator%3D%22eq%22%20value%3D%22'.$listIDs .'%22%20%2F%3E%3C%2Ffilter%3E%3Clink-entity%20name%3D%22ss_eqsdistributionlist%22%20from%3D%22ss_eqsdistributionlistid%22%20to%3D%22ss_eqsdistributionlistid%22%20%3E%3Cattribute%20name%3D%22ss_eqsdistributionlistid%22%20%2F%3E%3Cattribute%20name%3D%22'.$listname.'%22%20%2F%3E%3Cattribute%20name%3D%22'.$ListDescribtion.'%22%20%2F%3E%3C%2Flink-entity%3E%3C%2Flink-entity%3E%3C%2Flink-entity%3E%3C%2Flink-entity%3E%3C%2Fentity%3E%3C%2Ffetch%3E');
		$headers = [
            "Accept: application/json",
            "OData-MaxVersion: 4.0",
            "OData-Version: 4.0",
            "Authorization: Bearer " .$this->access_token,
			"Prefer: odata.include-annotations=OData.Community.Display.V1.FormattedValue" 
        ];
// Disable SSL verification
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
 
 $EQSListObj = new EQSDistributionList();
 $CategoryCheck ="";
		if(!isset($Jsondata["value"])){
			echo("Some Error Occured, Please provide valid id or Language name");
			return;
		}
 
		if(sizeof($Jsondata["value"])>0){
		$EQSListObj->id = $Jsondata["value"][0]['ss_eqsdistributionlist4_x002e_ss_eqsdistributionlistid'];
		if (array_key_exists($listname, $Jsondata["value"][0])) {
		$EQSListObj->name = $Jsondata["value"][0]['ss_eqsdistributionlist4_x002e_'.$listname];
		}else{
			$EQSListObj->name = "No Data";
		}
		if(array_key_exists($listname, $Jsondata["value"][0])){
		$EQSListObj->desc =	$Jsondata["value"][0]['ss_eqsdistributionlist4_x002e_'.$ListDescribtion];
		}else{
			$EQSListObj->desc = "No Data";
		}
		}
		else{
			echo("No Data Found for current id  ");
			return;
		}
 
 $CategoryArr = array();
   for($x = 0; $x < sizeof($Jsondata["value"]); $x++) { 
   
		$CategoryObj = new Category();
		$CategoryObj->id= $Jsondata["value"][$x]["ss_category"];
		$CategoryObj->name= $Jsondata["value"][$x]["ss_category@OData.Community.Display.V1.FormattedValue"];
			If($CategoryCheck =="" || $CategoryCheck != $Jsondata["value"][$x]["ss_category"])
			{
				$CategoryCheck = $Jsondata["value"][$x]["ss_category"];
				$MediumArr = array();
				
			for($y = 0; $y < sizeof($Jsondata["value"]); $y++) { 				
				if($CategoryCheck == $Jsondata["value"][$y]["ss_category"])
				{		
					 $MediumObj = new Medium();
					 $MediumObj->id = $Jsondata["value"][$y]["ss_mediumid"];
					 if(array_key_exists($listname, $Jsondata["value"][$y])){
					 $MediumObj->name = $Jsondata["value"][$y][$listname];
					 }else{
					 $MediumObj->name = "No Data";
					 }
					 $MediumArr[] = $MediumObj;
				}		 
			}
			$CategoryObj->media = $MediumArr;
			$CategoryArr[] =$CategoryObj;			
			}
   }
	$EQSListObj->categories =$CategoryArr;
	  return $EQSListObj;
		}else{
		    echo("Please provide the Valid Language and ListID \n");
		}
    
   }
}
?>