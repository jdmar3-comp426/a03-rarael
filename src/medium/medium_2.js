import mpg_data from "./data/mpg_data.js";
import {getStatistics} from "./medium_1.js";

/*
This section can be done by using the array prototype functions.
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array
see under the methods section
*/


/**
 * This object contains data that has to do with every car in the `mpg_data` object.
 *
 *
 * @param {allCarStats.avgMpg} Average miles per gallon on the highway and in the city. keys `city` and `highway`
 *
 * @param {allCarStats.allYearStats} The result of calling `getStatistics` from medium_1.js on
 * the years the cars were made.
 *
 * @param {allCarStats.ratioHybrids} ratio of cars that are hybrids
 */
export const allCarStats = {
    avgMpg: {city: findAverageMPGCity(), highway: findAverageMPGHighway()},
    allYearStats: findYearStatistics(),
    ratioHybrids: findHybridRatio(),
};

export function findAverageMPGCity() {
    let sum = 0
    let total = mpg_data.length
    mpg_data.forEach(element => {
        sum += element["city_mpg"]
    })
    return sum / total
};

export function findAverageMPGHighway() {
    let sum = 0
    let total = mpg_data.length
    mpg_data.forEach(element => {
        sum += element["highway_mpg"]
    })
    return sum / total
};

export function findYearStatistics() {
    let array =[]
    mpg_data.forEach(element => {
        array.push(element["year"])
    })
    return getStatistics(array)
};

export function findHybridRatio() {
    let numOfHybrids = 0
    let numOfNonHybrids = 0

    mpg_data.forEach(element => {
        if(element["hybrid"]) {
            numOfHybrids++;
        } else {
            numOfNonHybrids++;
        }
    })

    return numOfHybrids/numOfNonHybrids;
};

/**
 * HINT: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce
 *
 * @param {moreStats.makerHybrids} Array of objects where keys are the `make` of the car and
 * a list of `hybrids` available (their `id` string). Don't show car makes with 0 hybrids. Sort by the number of hybrids
 * in descending order.
 *
 *[{
 *     "make": "Buick",
 *     "hybrids": [
 *       "2012 Buick Lacrosse Convenience Group",
 *       "2012 Buick Lacrosse Leather Group",
 *       "2012 Buick Lacrosse Premium I Group",
 *       "2012 Buick Lacrosse"
 *     ]
 *   },
 *{
 *     "make": "BMW",
 *     "hybrids": [
 *       "2011 BMW ActiveHybrid 750i Sedan",
 *       "2011 BMW ActiveHybrid 750Li Sedan"
 *     ]
 *}]
 *
 *
 *
 *
 * @param {moreStats.avgMpgByYearAndHybrid} Object where keys are years and each year
 * an object with keys for `hybrid` and `notHybrid`. The hybrid and notHybrid
 * should be an object with keys for `highway` and `city` average mpg.
 *
 * Only years in the data should be keys.
 *
 * {
 *     2020: {
 *         hybrid: {
 *             city: average city mpg,
 *             highway: average highway mpg
 *         },
 *         notHybrid: {
 *             city: average city mpg,
 *             highway: average highway mpg
 *         }
 *     },
 *     2021: {
 *         hybrid: {
 *             city: average city mpg,
 *             highway: average highway mpg
 *         },
 *         notHybrid: {
 *             city: average city mpg,
 *             highway: average highway mpg
 *         }
 *     },
 *
 * }
 */
export const moreStats = {
    makerHybrids: findHybrids(),
    avgMpgByYearAndHybrid: findAvgMPGByYearAndHybrid(),

};

export function findHybrids() {
    let array = []
    mpg_data.forEach(element=> {
        // check to see if hybrid car
        if (element.hybrid) {
            //check if array contains object with the same make
            let makes = element["make"]
            let hasMake = false;
            array.forEach(element2 =>{
                let makes2 = element2["make"]
                //contains make already
                if (element2["make"] != undefined && makes == makes2) {
                    hasMake = true;
                    (element2.hybrids).push(element["id"])
                }
            })
            // does not contain make, need to make new object 
            if (!hasMake) {
                let array2 = [element["id"]]
                let obj = {make: element["make"], hybrids: array2}
                array.push(obj)
            }          
        }
    })
    //now need to sort by # of hybrids
    array.sort(function(a, b) {
        if(a.hybrids.length < b.hybrids.length) {
            return 1
        } else if(a.hybrids.length > b.hybrids.length) {
            return -1
        } else {
            return 0
        }
    })
    return array
}

export function findAvgMPGByYearAndHybrid() {
    let obj = new Object()
    mpg_data.forEach(element => {
        //Check to see if the year is in the obj
        let yearOfElement = element.year
        if(obj[element.year] != undefined) {
            // now calculate new average
            if (element.hybrid) {
                if(obj[element.year].hybrid == undefined) {
                    obj[element.year].hybrid.city = element.city_mpg 
                    obj[element.year].hybrid.highway = element.highway_mpg
                } else {
                    obj[element.year].hybrid.city = (obj[element.year].hybrid.city + element.city_mpg) / 2
                    obj[element.year].hybrid.highway = (obj[element.year].hybrid.highway) + element.highway_mpg
                }
            } else if (!element.hybrid){
                if(obj[element.year].notHybrid == undefined) {
                    obj[element.year].notHybrid.city = element.city_mpg 
                    obj[element.year].notHybrid.highway = element.highway_mpg
                } else {
                    obj[element.year].notHybrid.city = (obj[element.year].notHybrid.city + element.city_mpg) / 2
                    obj[element.year].notHybrid.highway = (obj[element.year].notHybrid.highway) + element.highway_mpg
                }
            }
        } else {
            obj[element.year] = {hybrid: {city: 0, highway: 0 }, notHybrid: {city: 0, highway: 0 }}
            if (element.hybrid) {
                obj[element.year].hybrid.city = element.city_mpg 
                obj[element.year].hybrid.highway = element.highway_mpg
            } else {
                obj[element.year].notHybrid.city = element.city_mpg 
                obj[element.year].notHybrid.highway = element.highway_mpg
            }
        }
    })
    return obj
}
