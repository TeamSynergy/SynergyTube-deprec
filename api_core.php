<?php
/*
*	This is the Offical SynergyTube JSON-API
*	It should support AJAX and SSE out of the box
*	Licensed under the MIT-License
*	For further infos goto: http://github.com/screeny05/synergytube
*	=============
*	ToDo:
*		- Check if Channel Exists
*		- User-related-functions
*	=============
*	Status-Codes:
*		00: OK
*		01: MySQL-Conncetion failed
*		02: MySQL-Query failed
*		03: Undefined 'method'-Parameter
*		04: Requested method is not declared in RestAPI::allowed_methods
*		05: Channel does not exist
*		06: User does not exist
*
*/


dbUtils::Connect("localhost", "root", "michael", "shout");
// RestAPI::getPlaylist(0);
RestUtils::processRequest();
dbUtils::Close();

class dbUtils
{
	// db-utils class for mySQL
	private static $con = null;
	public static function Query($query)
	{
		$res = self::$con->query($query) or RestUtils::sendResponse(2, self::$con->error, 'dbUtils::Query');
		$a = array();
		while($r = $res->fetch_assoc())
			$a[] = $r;
		$res->close();
		return $a;
	}
	public static function Escape($string)
	{
		return self::$con->real_escape_string($string);
	}
	public static function Connect($host, $user, $password, $db)
	{
		self::$con = new mysqli($host, $user, $password, $db);
		if(self::$con->connect_errno)
			RestUtils::sendResponse(1);
	}
	public static function Close()
	{
		self::$con->close();
	}
}

class RestUtils
{
	public static function sendResponse($status = 0, $content = '', $method = '')
	{
		header('Content-Type: application/json');
		$array_response = array(
			"method" => $method,
			"status" => $status,
			"content" => $content);
		print(json_encode($array_response));
		exit();
	}
	
	public static function initEventStream()
	{
		header('Content-Type: text/event-stream');
		$time = date('r');
		$array_response = array(
			"method" => "event-stream",
			"status" => 0,
			"content" => $time);
		print($time);
		flush();
	}
	
	public static function processRequest()
	{
		header('Cache-Control: no-cache');
		if(isset($_GET['method']))
			if(in_array($_GET['method'], RestAPI::$allowed_methods))
				RestAPI::$_GET['method']();
			else
				RestUtils::sendResponse(4);
		else
			RestUtils::sendResponse(3);
	}
}

class RestAPI
{
	public static $allowed_methods = array(
		"getPlaylist",
		"getChat",
		"getHeartbeat");
		
	public static function getPlaylist($channel_id)
	{
		$dataset = dbUtils::Query("SELECT pos, url, caption, length, name FROM tblVideos RIGHT JOIN tblUsers ON tblUsers._id = tblVideos.user_id WHERE channel_id = " . dbUtils::Escape($channel_id) . " ORDER BY pos DESC");
		RestUtils::sendResponse(0, $dataset);
	}
	
	public static function getChat($channel_id)
	{
		$dataset = dbUtils::Query("SELECT timestamp, content, name, picture FROM tblChat INNER JOIN tblUsers ON tblUsers._id = tblChat.user_id WHERE channel_id = " . dbUtils::Escape($channel_id) . " ORDER BY timestamp ASC");
		RestUtils::sendResponse(0, $dataset);
	}
	
	public static function getHeartbeat()
	{
		
		RestUtils::sendResponse();
	}
	
	public static function getChannel($channel_id)
	{
		
	}
}

?>