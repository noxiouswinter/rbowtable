'use strict';

/* Controllers */

var controllers = angular.module('myApp.controllers', []);

controllers.controller('CarListController', ['$scope', 'Car', function($scope, Car){
        
        //Not a copy. But a reference.
        var cachedCarsModel = null;
        var sortOrderToggle = true;
        
        var defaultCarsModel = {

            "cars": [
                {
                    "id": "mclaren-p1",
                    "name": "Mclaren P1",
                    "imageUrl": "img/cars/mclaren-p1.jpg",
                    "specs": [
                        {
                            "id": "horse-power",
                            "name": "Horse Power",
                            "value": 890,
                            "unit": "HP"
                        },
                        {
                            "id": "top-speed",
                            "name": "Top Speed",
                            "value": 349,
                            "unit": "km/h"
                        },
                        {
                            "id": "price",
                            "name": "Price",
                            "value": 1150000,
                            "unit": "USD"
                        }
                    ]
                },
                {
                    "id": "ferrari-528-italia",
                    "name": "Ferrari 528 Italia",
                    "imageUrl": "img/cars/Ferrari-458-Italia.jpg",
                    "specs": [
                        {
                            "id": "horse-power",
                            "name": "Horse Power",
                            "value": 528,
                            "unit": "HP"
                        },
                        {
                            "id": "top-speed",
                            "name": "Top Speed",
                            "value": 310,
                            "unit": "km/h"
                        },
                        {
                            "id": "price",
                            "name": "Price",
                            "value": 229825,
                            "unit": "USD"
                        }
                    ]
                },
                {
                    "id": "bugati-veyron-supersport",
                    "name": "Bugati Veyron Supersport",
                    "imageUrl": "img/cars/bugati-veyron-supersport.jpg",
                    "specs": [
                        {
                            "id": "horse-power",
                            "name": "Horse Power",
                            "value": 1200,
                            "unit": "HP"
                        },
                        {
                            "id": "top-speed",
                            "name": "Top Speed",
                            "value": 430.982,
                            "unit": "km/h"
                        },
                        {
                            "id": "price",
                            "name": "Price",
                            "value": 2426904,
                            "unit": "USD"
                        }
                    ]
                }
            ]
        };
        
        
        $scope.loadData = function() {
            
            if(cachedCarsModel == null){
                cachedCarsModel = defaultCarsModel;
            } else if($scope.carsModelInput != null) {
                cachedCarsModel = angular.fromJson($scope.carsModelInput);
            }
            
            $scope.tableModel = getDefaultTableModel(cachedCarsModel);
            //Refresh Positions
            positionElements();
            
            $scope.carsModelJsonDisplay = cachedCarsModel;
            
//            Car.getAll(function(carsModel) {
//                cachedCarsModel = carsModel;
//                $scope.tableModel = getDefaultTableModel(cachedCarsModel);
//                //Refresh Positions
//                positionElements();
//            });
        };
        
        $scope.loadData();
         
        function getDefaultTableModel(carsModel) {

           var tempTableModel = {"columnHeaderIds": [], "rowHeaderIds": [], "columnHeader" : [], "rowHeader" : [], "specsData": []};

           copyHeaderIds(tempTableModel, carsModel);
           populateColumnHeaderDataOrderedByColumnHeaderIds(tempTableModel, carsModel);
           populateRowHeaderDataOrderedByRowHeaderIds(tempTableModel, carsModel);
           populateSpecsDataOrderedByColumnHeaderIdsAndRowHeaderIds(tempTableModel, carsModel);

           return tempTableModel;
        }

        function copyHeaderIds(tableModel, carsModel) {

           //Get the cars array
           var cars = carsModel.cars;

           //Get the specs array
           var specs = cars[0].specs;

           //Populate columnHeaderIds
           for(var i = 0; i < cars.length; i++) {
               var car = cars[i];
               tableModel.columnHeaderIds.push(car.id);
           }

           //Populate rowHeaderIds
           for (var i = 0; i < specs.length; i++) {
               var spec = specs[i];
               tableModel.rowHeaderIds.push(spec.id);
           }
        };

        function populateColumnHeaderDataOrderedByColumnHeaderIds(tableModel, carsModel) {

            //Reset array
            tableModel.columnHeader = [];

            //Get the cars array
           var cars = carsModel.cars;

            //Populate columnHeader
           for(var i = 0; i < tableModel.columnHeaderIds.length; i++) {
               var carId = tableModel.columnHeaderIds[i];
               var car = getCarById(cars, carId);
               if(car === null) {
                   console.log('Car with carId: ' + carId + 'could be found from carsModel');
                   return;
               }
               var columnHeaderItem =  {"carId": "", "carName": ""};
               columnHeaderItem.carId = car.id;
               columnHeaderItem.carName = car.name;
               columnHeaderItem.carImageUrl = car.imageUrl;
               tableModel.columnHeader.push(columnHeaderItem);
           }
        };

        function populateRowHeaderDataOrderedByRowHeaderIds(tableModel, carsModel) {

            //Reset array
            tableModel.rowHeader = [];

            //Get the cars array
           var cars = carsModel.cars;

           //Get the specs array
           var specs = cars[0].specs;

            //Populate rowHeader 
           for(var i = 0; i < tableModel.rowHeaderIds.length; i++) {
               var specId = tableModel.rowHeaderIds[i];
               var spec = getSpecById(specs, specId);
               if(spec === null) {
                   console.log('Spec with specId: ' + specId + 'could be found from carsModel');
                   return;
               }
               var rowHeaderItem = {"specId": "", "specName": ""};
               rowHeaderItem.specId = spec.id;
               rowHeaderItem.specName = spec.name;
               rowHeaderItem.specUnit = spec.unit;
               tableModel.rowHeader.push(rowHeaderItem);
           }
        };

        function populateSpecsDataOrderedByColumnHeaderIdsAndRowHeaderIds(tableModel, carsModel) {

            //Get the cars array
           var cars = carsModel.cars;

            //Populate specsData
           var tempTableSpecsData = [];
           for(var i = 0; i < tableModel.columnHeaderIds.length; i++) {
               var carId = tableModel.columnHeaderIds[i];
               var currentCar = getCarById(cars, carId);
               if(currentCar === null) {
                   return;
               }

               var tempSpecsPerCar = [];
               for(var k = 0; k < tableModel.rowHeaderIds.length; k++) {
                   var specId = tableModel.rowHeaderIds[k];
                   var currentSpec;
                   for(var l = 0; l < currentCar.specs.length; l++) {
                       var spec = currentCar.specs[l];
                       if(spec.id == specId) {
                           currentSpec = spec;
                           break;
                       }
                   }
                   tempSpecsPerCar.push(currentSpec);
               }
               tempTableSpecsData.push(tempSpecsPerCar);
           }

           tableModel.specsData = tempTableSpecsData;
        };
         
        function getCarById(cars, carId) {
            var currentCar = null;
            for(var i = 0; i < cars.length; i++) {
                var car = cars[i];
                if(car.id == carId) {
                    currentCar = car;
                    break;
                }
            }
            return currentCar;
         };
         
         function getSpecById(specs, specId) {
            var currentSpec = null;
            for(var i = 0; i < specs.length; i++) {
                var spec = specs[i];
                if(spec.id == specId) {
                    currentSpec = spec;
                    break;
                }
            }
            return currentSpec;
         };
        
        $scope.OnColumnReorderButtonClicked = function(index, leftOrRight) {
            
            var columnHeaderIds = $scope.tableModel.columnHeaderIds;
            
            //Re-order columnHeaderIds
            if(leftOrRight == 'left') {
                shiftIndex(columnHeaderIds, index, 'towards');
            } else if(leftOrRight == 'right') {
                shiftIndex(columnHeaderIds, index, 'away');
            } 
            
            //Updating the model will update the DOM
            populateColumnHeaderDataOrderedByColumnHeaderIds($scope.tableModel, cachedCarsModel);
            populateSpecsDataOrderedByColumnHeaderIdsAndRowHeaderIds($scope.tableModel, cachedCarsModel);
        };
        
        $scope.OnRowReorderButtonClicked = function(index, upOrDown) {
            
            var rowHeaderIds = $scope.tableModel.rowHeaderIds;
            
            //Re-order rowHeaderIds
            if(upOrDown == 'up') {
                shiftIndex(rowHeaderIds, index, 'towards');
            } else if(upOrDown == 'down') {
                shiftIndex(rowHeaderIds, index, 'away');
            } 

            //Updating the model will update the DOM
            populateRowHeaderDataOrderedByRowHeaderIds($scope.tableModel, cachedCarsModel);
            populateSpecsDataOrderedByColumnHeaderIdsAndRowHeaderIds($scope.tableModel, cachedCarsModel);
        };
        
        $scope.OnSortBySpecButtonClicked = function(index) {
            
            var specIdToSoryBy = $scope.tableModel.rowHeaderIds[index];
            
            //Create array of {carId, specValue of specId} from carsModel
            //Sort by specValue
            //Replace ColumnHeaderIds with carIds
            var cars = cachedCarsModel.cars;
            var carSpecValues = [];
            
            for(var i = 0; i < cars.length; i++) {
                
                var car = cars[i];
                var carSpecs = car.specs;
                var carSpecToSortBy = null;
                
                for(var j = 0; j < carSpecs.length; j++) {
                    var currentSpec = carSpecs[j];
                    if(currentSpec.id == specIdToSoryBy) {
                        carSpecToSortBy = currentSpec;
                        break;
                    }
                }
                
                var carSpecInfo = {"carId": "", "specValue": 0};
                carSpecInfo.specValue = carSpecToSortBy.value;
                carSpecInfo.carId = car.id;
                carSpecValues.push(carSpecInfo);
            }
            
            //Sorting
            function compareCarSpecValues(carSpecValue1, carSpecValue2) {
                if (carSpecValue1.specValue < carSpecValue2.specValue)
                   return -1;
                if (carSpecValue1.specValue > carSpecValue2.specValue)
                  return 1;
                return 0;
            }
            carSpecValues.sort(compareCarSpecValues);
            
            //Toggle sort order every time
            if(sortOrderToggle == true){
                carSpecValues.reverse();
                sortOrderToggle = false;
            } else {
                sortOrderToggle = true;
            }

            var SortedColumnHeaderIds = [];
            for(var i = 0; i < carSpecValues.length; i++) {
                SortedColumnHeaderIds.push(carSpecValues[i].carId);
            }
            
            //Assign sorted values scope variable
            $scope.tableModel.columnHeaderIds = SortedColumnHeaderIds;
            
            //Update columnHeader and Specs area
            populateColumnHeaderDataOrderedByColumnHeaderIds($scope.tableModel, cachedCarsModel);
            populateSpecsDataOrderedByColumnHeaderIdsAndRowHeaderIds($scope.tableModel, cachedCarsModel);
        };
        
        function shiftIndex(array, index, towardsOrAwayFromZero) {
            
            if( towardsOrAwayFromZero == 'towards' && index > 0) {
                var indexValue = array[index];
                array[index] = array[index - 1];
                array[index - 1] = indexValue;
                
            } else if(towardsOrAwayFromZero == 'away' && index <  (array.length - 1)) {
                
                var indexValue = array[index];
                array[index] = array[index + 1];
                array[index + 1] = indexValue;
            }
        };
        
        function positionElements() {

            var Unit = 'px';
        
            var padding = 10;
            var innerPadding = 5;
            var numberOfRows = $scope.tableModel.rowHeaderIds.length;
            var numberOfColumns = $scope.tableModel.columnHeaderIds.length;

            //Row Header
            var rowHeaderBoxWidth = 150;
            var rowHeaderBoxHeight = 70;
            var rowHeaderBoxContentWidth = 130;
            var rowHeaderBoxContentHeight = rowHeaderBoxHeight;
            var rowHeaderBoxNavWidth = rowHeaderBoxWidth - rowHeaderBoxContentWidth - 2; //Tweak
            var rowHeaderBoxNavHeight = rowHeaderBoxHeight;
            var rowHeaderWidth = rowHeaderBoxWidth + padding;
            var rowHeaderHeight = (rowHeaderBoxHeight + padding) * numberOfRows;

            //Column Header
            var columnHeaderBoxWidth = 200;
            var columnHeaderBoxHeight = 175;
            var columnHeaderBoxContentWidth = columnHeaderBoxWidth;
            var columnHeaderBoxContentHeight = 155;
            var columnHeaderBoxContentImageWidth = columnHeaderBoxContentWidth;
            var columnHeaderBoxContentImageHeight = columnHeaderBoxContentHeight;
            var columnHeaderBoxNavWidth = columnHeaderBoxWidth;
            var columnHeaderBoxNavHeight = columnHeaderBoxHeight - columnHeaderBoxContentHeight; 
            var columnHeaderWidth = (columnHeaderBoxWidth + padding) * numberOfColumns;
            var columnHeaderHeight = columnHeaderBoxHeight + padding;

            //Head Node
            var headNodeBoxWidth = rowHeaderBoxWidth;
            var headNodeBoxHeight = columnHeaderBoxHeight;
            var headNodeWidth = rowHeaderBoxWidth + padding;
            var headNodeHeight = columnHeaderBoxHeight + padding;

            //Specs Area
            var specsContentWidth = columnHeaderBoxWidth;
            var specsContentHeight = rowHeaderBoxHeight;
            var specsColumnWidth = columnHeaderBoxWidth + padding;
            var specsColumnHeight = rowHeaderHeight;
            var specsAreaWidth = specsColumnWidth * numberOfColumns;
            var specsAreaHeight = specsColumnHeight;
            
            //Table
            var tableWidth = rowHeaderWidth + columnHeaderWidth + padding;
            var tableHeight = rowHeaderHeight + columnHeaderHeight + padding;

            //Positions
            var headNodeLeft = 0;
            var headNodeTop = 0;

            var rowHeaderLeft = 0;
            var rowHeaderTop = headNodeHeight;

            var columnHeaderLeft = headNodeWidth;
            var columnHeaderTop = 0;

            var specsAreaLeft = headNodeWidth;
            var specsAreaTop = headNodeHeight;
                
                
            //Not Used.
            $scope.rbowBox2 = {
                'float': 'left',
                'margin-top': '10px',
                'margin-left': '10px',
                'border': '1px solid black',
                'overflow': 'scroll'
            };

            $scope.rbowTable = {
                'position': 'relative',
                'width': tableWidth+Unit,
                'height': tableHeight+Unit,
                
                '-moz-border-radius': '3px',
                '-webkit-border-radius': '3px',
                'border-radius': '3px',
                
                'background-color': 'white',
                'border': '1px solid lightgrey'
            };

            $scope.rbowHeadNode = {
                'position': 'absolute',
                'left': headNodeLeft+Unit,
                'top':  headNodeTop+Unit,
                'width':headNodeWidth+Unit,
                'height': headNodeHeight+Unit,
//                'background-color': '#9999ff'
            };

            $scope.rbowHeadNodeBox = {
                'width': headNodeBoxWidth+Unit,
                'height': headNodeBoxHeight+Unit
            };

            $scope.rbowHeadNodeBoxContent = {
                'float': 'left',
                'width': rowHeaderBoxWidth+Unit, 
                'height': columnHeaderBoxHeight+Unit,
                'background-color': '#F7F7F9'
            };

            $scope.rbowRowHeaderBoxNav = {
                'float': 'right',
                'width': rowHeaderBoxNavWidth+Unit,
                'height': rowHeaderBoxNavHeight+Unit,
                'background-color': 'Gainsboro '
            };

            $scope.rbowColumnHeaderBoxNav = {
                'float': 'left',
                'width': columnHeaderBoxNavWidth+Unit,
                'height': columnHeaderBoxNavHeight+Unit,
                'background-color': 'Gainsboro '
            };

            $scope.rbowColumnHeader = {
                'position': 'absolute',
                'left': columnHeaderLeft+Unit,
                'top': columnHeaderTop+Unit,
                'width': columnHeaderWidth+Unit,
                'height': columnHeaderHeight+Unit,
//                'background-color': 'greenyellow'
            };

            $scope.rbowColumnHeaderBox = {
                'width': columnHeaderBoxWidth+Unit,
                'height': columnHeaderBoxHeight+Unit
            };

            $scope.rbowColumnHeaderBoxContent = {
                'float': 'left',
                'width': columnHeaderBoxContentWidth+Unit,
                'height': columnHeaderBoxContentHeight+Unit,
                'padding': innerPadding+Unit,
                'background-color': '#F7F7F9',
                'overflow': 'scroll'
            };
            
            $scope.rbowColumnHeaderBoxContentImage = {
                'float': 'left',
                'width': columnHeaderBoxContentImageWidth+Unit,
                'height': columnHeaderBoxContentImageHeight+Unit,
            };

            $scope.rbowRowHeader = {
                'position': 'absolute',
                'left': rowHeaderLeft+Unit,
                'top':  rowHeaderTop+Unit,
                'width': rowHeaderWidth+Unit,
                'height': rowHeaderHeight+Unit,
            };

            $scope.rbowRowHeaderBox = {
                'width': rowHeaderBoxWidth+Unit,
                'height': rowHeaderBoxHeight+Unit
            };

            $scope.rbowRowHeaderBoxContent = {
                'float': 'left',
                'width': rowHeaderBoxContentWidth+Unit,
                'height': rowHeaderBoxContentHeight+Unit,
                'background-color': '#F7F7F9',
                'padding': innerPadding+Unit,
                'overflow': 'scroll'
            };

            $scope.rbowSpecsArea = {
                'position': 'absolute',
                'left': specsAreaLeft+Unit,
                'top': specsAreaTop+Unit,
                'width': specsAreaWidth+Unit,
                'height': specsAreaHeight+Unit,
            };

            $scope.rbowSpecsColumn = {
                'float': 'left',
                'width': specsColumnWidth+Unit,
                'height': specsColumnHeight+Unit,
            };

            $scope.rbowSpecsContent = {
                'width': specsContentWidth+Unit,
                'height': specsContentHeight+Unit,
                'background-color': 'white',
                'padding': innerPadding+Unit,
                'overflow': 'scroll'
            }

        };
        
    }]);

controllers.controller('CarDetailController', ['$scope', '$routeParams', 'Car',
    function($scope, $routeParams, Car) {
        $scope.car = Car.get({carId: $routeParams.carId}, function(car) {
            //TODO or NOT-TODO is the question.
        });
    }]);