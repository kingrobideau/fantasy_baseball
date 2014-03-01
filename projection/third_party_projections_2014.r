setwd('C:/Users/Michael Robideau/Documents/GitHub/fantasy_baseball/scraper')
d <- read.csv('batter_standard_2013.csv')

#FUNCTIONS

oliver <- d[d$team=="Oliver",]
steamer <- d[d$team=="Steamer",]

zscores <- function(d) {
  d <- transform(d, z_hr = scale(hr))
  d <- transform(d, z_r = scale(r))
  d <- transform(d, z_rbi = scale(rbi))
  d <- transform(d, z_avg = scale(avg))
  d <- transform(d, z_sb = scale(sb))
  d <- transform(d, z_total = z_hr + z_r + z_rbi + z_avg + z_sb)
}

oliver <- zscores(oliver)
steamer <- zscores(steamer)

#EXPLORE
summary(oliver$z_total)
summary(steamer$z_total)

oliver[oliver$name=='Jose Bautista',]

sub <- subset(oliver[oliver$pos=='SS',], select=c("name", "z_total"))

#EXPORT
write.csv(oliver, 'projections_2014_batter_oliver.csv')
write.csv(steamer, 'projections_2014_batter_steamer.csv')
