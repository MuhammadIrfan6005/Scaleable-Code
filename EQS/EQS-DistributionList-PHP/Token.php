<?php
class Token{
    private $access_token;

    private $tenant_id;
    private $client_id;
    private $username;
    private $password;
    private $org_url;
    public function __construct($tenant_id, $client_id, $username, $password, $org_url){
        $this->tenant_id = $tenant_id;
        $this->client_id = $client_id;
        $this->username = $username;
        $this->password = $password;
        $this->org_url = $org_url;
    }

    public function send_token_request()
    {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, "https://login.microsoftonline.com/".$this->tenant_id."/oauth2/token");
        curl_setopt($ch, CURLOPT_POST, 5);
        curl_setopt($ch, CURLOPT_POSTFIELDS, "client_id=".$this->client_id."&resource=".$this->org_url."&username=".$this->username."&password=".$this->password."&grant_type=password");
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        $response = curl_exec($ch);
        $obj = json_decode($response);
        $this->access_token = $obj->access_token;
        curl_close($ch);
    }

    function get_access_token()
    {
        return $this->access_token;
    }
}
?>