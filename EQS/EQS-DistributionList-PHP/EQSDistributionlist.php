<html>
<head>
    <title>Blank Web Page</title>
</head>
	<body>
	<?php
		require 'Token.php';
		require 'EQSDistributionlistHelper.php';
		ob_start();

		$token = new Token("643fbbdc-a0a5-4bec-845b-c5bb984bc579","4ab95d77-7aaa-401f-849f-e29abd51efae","aamir@eqsgroup365.onmicrosoft.com","Scale611SolEQS","https://eqsgroupsandbox.crm4.dynamics.com/");
		$token->send_token_request();

		$eqsdistributionlist = new EQSDistributionListRequest($token->get_access_token());
		$eqsdistributionlists = $eqsdistributionlist->get_eqsdistributionList();
		?>
		<table  border="1">
		 <tr>
    <th colspan="4">List ID</th>
    <th colspan="3">List Name</th>
	  <th colspan="2">Action</th>
  </tr>
		<?php
		$Parameterdata = $_GET['lang'];
		if(	$Parameterdata == "DE"){
			$result = "ss_name";
		}
		else if($Parameterdata == "de"){
			$result = "ss_name";
		}
		else{
		$result = "ss_name". strtolower($_GET['lang']);
		}
		if($eqsdistributionlists != null){ 
	     for ($x = 0; $x < sizeof($eqsdistributionlists->eqs_dist_lists); $x++) {
			 ?>
			<tr>
			<td colspan="4">
			<?php print_r($eqsdistributionlists->eqs_dist_lists[$x]->id);?>
			</td>
			<td colspan="3">
			<?php print_r($eqsdistributionlists->eqs_dist_lists[$x]->name);?>
			</td>
			<form method="POST" >
			<td colspan="2">
			<a  href='EQSDistributionlistDetail.php?lang=<?php echo $Parameterdata; ?>&id=<?= $eqsdistributionlists->eqs_dist_lists[$x]->id ?>'>List Detail</a>
			</td>
			</form>
			</tr>
			<?php
		 }
		}
		
	?>
</table>
<h2>Json Data</h2>
<div>
<?php
echo json_encode($eqsdistributionlists);
?>

</div>
</body>
</html>


