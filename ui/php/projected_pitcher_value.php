<?php

require_once('mysqli_connect.php');

$sql = "
		SELECT
			mean.player_id,
			mean.name,
			yahoo.pos,
			lg.league,
			mean.year,
			mean.w as mean_vW,
			mean.sv as mean_vSv,
			mean.k as mean_vK,
			mean.era as mean_vEra,
			mean.whip as mean_vWhip,
			steamer.total as steamer_value,
			zips.total as zips_value,
			fans.total as fans_value,
			mean.total as mean_value,
			head.file as headshot_file
		FROM (SELECT * FROM projected_pitcher_value WHERE system = 'Steamer-ZiPS-Fans Mean') mean
		JOIN yahoo_player yahoo ON yahoo.fangraphs_player_id = mean.player_id
		JOIN league lg ON lg.team = yahoo.team
		JOIN headshot_file head ON head.player_id = mean.player_id
		JOIN (SELECT * FROM projected_pitcher_value WHERE system = 'Steamer') steamer
			ON steamer.player_id = mean.player_id
		JOIN (SELECT * FROM projected_pitcher_value WHERE system = 'ZiPS') zips
			ON zips.player_id = mean.player_id
		JOIN (SELECT * FROM projected_pitcher_value WHERE system = 'Fans') fans
			ON fans.player_id = mean.player_id
		ORDER BY mean.total DESC;
	";

require_once('mysqli_query.php');

?>