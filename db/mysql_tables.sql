<<<<<<< HEAD
CREATE SCHEMA `fantasy_commander` ;

=======
>>>>>>> FETCH_HEAD
CREATE  TABLE `fantasy_commander`.`fangraphs_batter_standard` (
  `player_id` INT NOT NULL ,
  `name` VARCHAR(45) NULL ,
  `pos` VARCHAR(10) NULL ,
  `dob` VARCHAR(10) NULL ,
  `current_team` VARCHAR(45) NULL ,
  `year` VARCHAR(45) NOT NULL ,
  `team` VARCHAR(45) NOT NULL ,
  `g` INT(4) NULL ,
  `pa` INT(5) NULL ,
  `hr` INT(4) NULL ,
  `r` INT(4) NULL ,
  `rbi` INT(4) NULL ,
  `sb` INT(4) NULL ,
  `bb_pct` VARCHAR(6) NULL ,
  `k_pct` VARCHAR(6) NULL ,
<<<<<<< HEAD
  `iso` DECIMAL(3,3) NULL ,
  `babip` DECIMAL(3,3) NULL ,
  `avg` DECIMAL(3,3) NULL ,
  `obp` DECIMAL(3,3) NULL ,
  `slg` DECIMAL(3,3) NULL ,
  `woba` DECIMAL(3,3) NULL ,
=======
  `iso` DECIMAL(1,3) NULL ,
  `babip` DECIMAL(1,3) NULL ,
  `avg` DECIMAL(1,3) NULL ,
  `obp` DECIMAL(1,3) NULL ,
  `slg` DECIMAL(1,3) NULL ,
  `woba` DECIMAL(1,3) NULL ,
>>>>>>> FETCH_HEAD
  `wrc_plus` INT(4) NULL ,
  `bsr` DECIMAL(3,1) NULL ,
  `off` DECIMAL(3,1) NULL ,
  `def` DECIMAL(3,1) NULL ,
  `war` DECIMAL(3,1) NULL ,
<<<<<<< HEAD
  PRIMARY KEY (`player_id`, `year`, `team`) );

CREATE  TABLE `fantasy_commander`.`league` (
  `team` VARCHAR(45) NOT NULL ,
  `league` VARCHAR(45) NULL ,
  PRIMARY KEY (`team`) );

CREATE  TABLE `fantasy_commander`.`yahoo_player` (
  `name` VARCHAR(45) NULL ,
  `fangraphs_player_id` VARCHAR(45) NOT NULL ,
  `pos` VARCHAR(45) NULL ,
  `team` VARCHAR(45) NULL ,
  `year` VARCHAR(45) NOT NULL ,
  PRIMARY KEY (`fangraphs_player_id`, `year`) );

CREATE  TABLE `fantasy_commander`.`projected_batter_value` (
  `player_id` INT NOT NULL ,
  `name` VARCHAR(45) NOT NULL ,
  `system` VARCHAR(45) NOT NULL ,
  `year` VARCHAR(4) NOT NULL ,
  `r` FLOAT() NULL ,
  `hr` FLOAT() NULL ,
  `rbi` FLOAT() NULL ,
  `avg` FLOAT() NULL ,
  `sb` FLOAT() NULL ,
  `total` FLOAT() NULL,
  PRIMARY KEY (`player_id`, `name`, `system`, `year`) );

CREATE  TABLE `fantasy_commander`.`projected_pitcher_value` (
  `player_id` INT NOT NULL ,
  `name` VARCHAR(45) NOT NULL ,
  `system` VARCHAR(45) NOT NULL ,
  `year` VARCHAR(4) NOT NULL ,
  `w` FLOAT() NULL ,
  `sv` FLOAT() NULL ,
  `k` FLOAT() NULL ,
  `era` FLOAT() NULL ,
  `whip` FLOAT() NULL ,
  `total` FLOAT() NULL,
  PRIMARY KEY (`id`, `name`, `system`, `year`) );

CREATE  TABLE `fantasy_commander`.`headshot_file` (
  `player_id` INT NOT NULL ,
  `file` VARCHAR(45) NULL ,
  PRIMARY KEY (`player_id`) );

=======
  PRIMARY KEY (`player_id`, `year`, `team`) );
>>>>>>> FETCH_HEAD
