

	
<?php
header('Content-type: application/json');
require 'Token.php';
require 'EQSDistributionlistDetailHelper.php';
ob_start();

$token = new Token("643fbbdc-a0a5-4bec-845b-c5bb984bc579","4ab95d77-7aaa-401f-849f-e29abd51efae","aamir@eqsgroup365.onmicrosoft.com","Scale611SolEQS","https://eqsgroupsandbox.crm4.dynamics.com/");
$token->send_token_request();

$eqsdistributionlistDetail = new EQSDistributionListDetailRequest($token-> get_access_token());
$eqsdistributionlistsDetails = $eqsdistributionlistDetail-> get_eqsdistributionListDetail();
echo json_encode($eqsdistributionlistsDetails);
?>
<?php

?>


