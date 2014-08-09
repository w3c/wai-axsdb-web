test( "Table sort", function() {
    var table = $('#TestResultsFullViewByTechnique_table');
    var targetTable = $('#TestResultsFullViewByTechnique_table_target');
    Utils.sortResultsTable(table,targetTable);
    ok( $(table).find("thead th").length === $(targetTable).find("thead th").length, "no of headers are ok" );
    ok( $(table).find("thead td").length === $(targetTable).find("thead td").length, "no of headers are ok" );
});