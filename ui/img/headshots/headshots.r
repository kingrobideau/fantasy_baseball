setwd('C:/Users/Michael Robideau/Documents/GitHub/FantasyBaseball/scraper')
d <- read.csv('batter_standard_2013.csv')

exp_files <- unique(tolower(paste(gsub(" ", "_", d$name), ".jpg", sep="")))
img_files <- list.files('C:/Users/Michael Robideau/Documents/GitHub/FantasyBaseball/ui/img/headshots/img')
                           
img_in_exp <- exp_files[match(img_files, exp_files)]
exp_in_img <- img_files[match(exp_files, img_files)]

unmatched_data <- exp_files[is.na(exp_in_img)]
unmatched_img <- img_files[is.na(img_in_exp)]

pct_matched_data <- (length(exp_files) - length(unmatched_data)) / length(exp_files)

#EXPORT
'C:/Users/Michael Robideau/Documents/GitHub/FantasyBaseball/ui/img/headshots'

export <- data.frame(id=unique(d$player_id), file=exp_files)
write.csv(export, 'headshot_files.csv')
