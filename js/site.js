
function provincesMapShow(){
            $('#map2').hide();           
            $('#map').show();
            map2_chart.filterAll();
            dc.redrawAll();
        }
        
        function municipalitiesMapShow(){
            $('#map').hide();
            $('#map2').show();
        }
        $('#dashboard').hide();
        $('#map').hide();
        
		
		//var sector_chart = dc.pieChart("#sector");
		var sector_chart = dc.rowChart("#sector");
        var status_chart = dc.pieChart("#status");
        var map_chart = dc.geoChoroplethChart("#map");
        var org_chart = dc.rowChart("#orgs");
        var map2_chart = dc.geoChoroplethChart("#map2");
        		
		/*
		var ID_chart = dc.pieChart("#ID");
		var Organisation_chart = dc.pieChart("#Organisation");
		var Sector_chart = dc.pieChart("#Sector");
		var Subsector_chart = dc.pieChart("#Subsector");
				
        var map_chart = dc.geoChoroplethChart("#map");
        var org_chart = dc.rowChart("#orgs");
        var map2_chart = dc.geoChoroplethChart("#map2");
		*/
		
				
        d3.csv("data/3W_Data_NewComma.csv", function(csv_data){
            
			var cf = crossfilter(csv_data);
			
            cf.ID = cf.dimension(function(d) { return d.ID; });
			cf.subsector = cf.dimension(function(d) { return d.Subsector; });
			cf.Service = cf.dimension(function(d) { return d.Service; });
            cf.sector = cf.dimension(function(d) { return d.Sector; });
			cf.status = cf.dimension(function(d) { return d.Status; });
            cf.pcode = cf.dimension(function(d) { return d.Province_CODE; });
			cf.mcode = cf.dimension(function(d) { return d.Municipality_CODE; });
			cf.organisation = cf.dimension(function(d) { return d.Organisation; });
			cf.beneficiarytype = cf.dimension(function(d) { return d.Beneficiary_type; });
			cf.barangay = cf.dimension(function(d) { return d.Barangay; });
						
            var sector = cf.sector.group();
            var status = cf.status.group();
            var pcode = cf.pcode.group();
            var organisation = cf.organisation.group();
            var all = cf.groupAll();
            var mcode = cf.mcode.group();
            
            sector_chart.width(350).height(180)
                .dimension(cf.sector)
                .group(sector)
                //.innerRadius(10)
                .colors(['#fd8d3c',
                        '#fc4e2a',
                        '#e31a1c',
                        '#bd0026',
                        '#800026',
                        '#807dba',
                        '#6a51a3',
                        '#54278f',
                        '#3f007d'])
                .colorDomain([0,8])
                .colorAccessor(function(d, i){return i%9;});
            
            status_chart.width(180).height(180)
                .dimension(cf.status)
                .group(status)
                .innerRadius(10)
                .colors(['#2ca25f',                                   
                        '#3182bd',
                        '#ffeda0'                                                                                                         
                        ])
                .colorDomain([0,3])
                .colorAccessor(function(d, i){return i%4;});
            
            org_chart.width(320).height(300)
                .dimension(cf.organisation)
                .group(organisation)
                .elasticX(true)
                .data(function(group) {
                    return group.top(10);
                })
                .colors(['#3182bd'])
                .colorDomain([0,0])
                .colorAccessor(function(d, i){return 1;});
                
            dc.dataCount("#count-info")
		.dimension(cf)
		.group(all);
                            
            d3.json("data/Phil_provinces.geojson", function (provincesJSON) {
                
                map_chart.width(660).height(600)
                    .dimension(cf.pcode)
                    .group(pcode)
                    .colors(['#AAAAAA', '#CB181D'])
                    .colorDomain([0, 1])
                    .colorAccessor(function (d) {
                        if(d>0){
                            return 1;
                        } else {
                            return 0;
                        }
                    })
                    .overlayGeoJson(provincesJSON.features, "Province", function (d) {
                        return d.properties.P_Str;
                    })
                    .projection(d3.geo.mercator().center([123,17.5]).scale(8000))
                    .title(function (d) {
                        return "Province: " + pcode2prov[d.key];
                    });
                    
                    d3.json("data/Phil_municipalities.geojson", function (municJSON){
                        map2_chart.width(660).height(600)
                            .dimension(cf.mcode)
                            .group(mcode)
                            .colors(['#AAAAAA', '#CB181D'])
                            .colorDomain([0, 1])
                            .colorAccessor(function (d) {
                                if(d>0){
                                    return 1;
                                } else {
                                    return 0;
                                }
                            })
                            .overlayGeoJson(municJSON.features, "Municipalities", function (d) {
                                return d.properties.MUN_P_STR;
                            })
                            .projection(d3.geo.mercator().center([123,17.5]).scale(8000))
                            .title(function (d) {
                                return "Municipality: " + mcode2mun[d.key];
                            });
                            $('#loading').hide();
                            $('#dashboard').show();
                            dc.renderAll();
                            
                    });                    
                });            
        });