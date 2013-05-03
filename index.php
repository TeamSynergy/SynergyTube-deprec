<?php require("require/config.inc.php"); ?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>SynergyTube</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <link href="//netdna.bootstrapcdn.com/twitter-bootstrap/2.3.1/css/bootstrap-combined.min.css" rel="stylesheet">
  <link href="<?php echo $sgtube_root;?>/assets/css/style.css" rel="stylesheet">
  <link href="<?php echo $sgtube_root;?>/assets/css/custom.css" rel="stylesheet">
  <link href="//netdna.bootstrapcdn.com/twitter-bootstrap/2.3.1/css/bootstrap-responsive.min.css" rel="stylesheet">
</head>
<body>
  <div class="navbar">
    <div class="navbar-inner">
      <div class="container">
        <a class="btn btn-navbar" data-toggle="collapse" data-target=".nav-collapse">
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
        </a>

        <a class="brand" href="<?php echo $sgtube_root;?>/">SynergyTube</a>
        
        <div class="nav-collapse collapse">
          <ul class="nav">
            <li class="active"><a href="<?php echo $sgtube_root;?>/">Channels</a></li>
            <li><a href="<?php echo $sgtube_root;?>/categories">Categories</a></li>
          </ul>
          <ul class="nav pull-right">
            <li><a href="#">Login</a></li>
          </ul>
        </div>
      </div>
    </div>
  </div>

  <div class="content-wrap">
    <div class="container content">
      <div class="page-header"><h1>Browse all Channels</h1></div>
      <ul class="channel-previews unstyled">
        
        <?php require("require/overview_init.php"); ?>

      </ul>
    </div>
    <div class="footer-pusher"></div>
  </div>

  <div class="footer">
    <div class="container footer-container">
      <p>&copy; SynergyTube by Screeny05; Fork me on <a href="#">GitHub</a></p>
    </div>
  </div>



  <script src="<?php echo $sgtube_root;?>/assets/js/jquery.min.js"></script>
  <script src="<?php echo $sgtube_root;?>/assets/js/bootstrap.min.js"></script>
  <script src="<?php echo $sgtube_root;?>/assets/js/jquery.ddd.min.js"></script>
  <script>$('.preview').each(function(_){$(this).dotdotdot({watch:true});});$('._tt').tooltip({placement:'bottom'});</script>
</body>
</html>
