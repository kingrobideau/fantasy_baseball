library(plm)

#--------------------------------------------------
#FUNCTIONS
#--------------------------------------------------

removeProjections <- function(d) { 
  return(d[!d$team %in% c("Steamer", "Oliver"),])
}

removeTotals <- function(d) { 
  return(d[d$team !="- - -",])
}

removeMinors <- function(d) {
  minors <- grepl("\\(", d$team)
  return(d[!minors,])
}

#------------------------------
#LOAD, PREPARE DATA
#------------------------------
setwd('C:/Users/Michael Robideau/Documents/GitHub/FantasyBaseball/scraper')
d <- read.csv('batter_standard_2013.csv')

#MLB regular season subset
rs <- removeMinors(d)
rs <- removeProjections(rs)
rs <- removeTotals(rs)

#Eliminate small sample seasons
rs <- subset(rs, pa>=100) 

#Age / Distance from prime
rs$age <- as.numeric(difftime(as.Date(paste("04/01/", rs$year), "%m/%d/%Y"), 
                   as.Date(rs$dob, "%m/%d/%Y"), unit="weeks"))/52.25 #age in years on 04/01 of year
prime <- 29
rs$years_from_prime = abs(prime - rs$age)

#------------------------------
#3rd Party Projections
#------------------------------
setwd('C:/Users/Michael Robideau/Documents/GitHub/FantasyBaseball/Projections')
steamer <- d[d$team=='Steamer',]
oliver <- d[d$team=='Oliver',]

write.csv(oliver, 'projections_2014_batter_oliver.csv')
write.csv(steamer, 'projections_2014_batter_steamer.csv')

#------------------------------
#BABIP Analysis
#------------------------------
hist(rs$babip, main="BABIP Histogram", xlab="BABIP", col="green", breaks=50)

#------------------------------
#PANEL DATA ANALYSIS
#------------------------------

#Remove duplicates - TO DO: Create a method that reduces duplicate rows
rs <- rs[!duplicated(rs[c("player_id", "year")]),]
pnl <- pdata.frame(rs, index=c("player_id", "year"))

#HR Model
hist(pnl$hr, main="HR Histogram", xlab="HR", col="green", breaks=50)

hrFit <- plm(hr ~ years_from_prime + diff(hr, 1) + diff(hr, 2) + diff(hr, 3) + diff(hr, 4) + diff(hr, 5), data=pnl, model="within")
summary(hrFit)

#AVG Model
hist(pnl$avg, main="Avg Histogram", xlab="Avg", col="green", breaks=50)

avgFit <- plm(avg ~ years_from_prime + diff(avg, 1) + diff(avg, 2) + diff(avg, 3) + diff(avg, 4) + diff(avg, 5), data=pnl, model="within")
summary(avgFit)

#wOBA fit
hist(pnl$woba, main="wOBA Histogram", xlab="wOBA", col="green", breaks=50)
subset(pnl, woba==max(pnl$woba)) #max wOBA in dataset

wobaFit <- plm(woba ~ years_from_prime + diff(woba, 1) + diff(woba, 2) + diff(woba, 3) + diff(woba, 4) + diff(woba, 5), data=pnl, model="within")
summary(wobaFit)

#naive RBI fit
hist(pnl$rbi, main="RBI Histogram", xlab="RBI", col="green")

rbiFit <- plm(rbi ~ years_from_prime + diff(rbi, 1) + diff(rbi, 2) + diff(rbi, 3) + diff(rbi, 4) + diff(rbi, 5), data=pnl, model="within")
summary(rbiFit)

#naive RUN fit
hist(pnl$r, main="R Histogram", xlab="R", col="green")

rFit <- plm(r ~ years_from_prime + diff(r, 1) + diff(r, 2) + diff(r, 3) + diff(r, 4) + diff(r, 5), data=pnl, model="within")
summary(rFit)
