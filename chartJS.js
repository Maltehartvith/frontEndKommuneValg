//Her loader man googles API til deres pie chart
google.charts.load('current', {'packages': ['corechart']});
google.charts.setOnLoadCallback(drawChart);

// Google chart, som er taget fra W3school, hvor man kan sætte værdier ind i et pie chart
function drawChart() {
    let socialdemokratiet = 0, radikaleVenstre = 0, detKonservertiveFolkeparti = 0, nyeBorgerlige = 0,
        socialistiskFolkeparti = 0, liberalAlliance = 0, kristendemokraterne = 0, lokallistenGladsaxe = 0,
        danskFolkeparti = 0, venstre = 0, enhedslisten = 0;
    //Foreach loop som går igennem alle partierne og akkumulerede voteringer

    cache.getAll().forEach(c => {

        if (c.party === "Socialdemokratiet")
            socialdemokratiet += c.votes

        if (c.party === "Radikale Venstre")
            radikaleVenstre += c.votes

        if (c.party === "Det Konservative Folkeparti")
            detKonservertiveFolkeparti += c.votes

        if (c.party === "Nye Borgerlige")
            nyeBorgerlige += c.votes

        if (c.party === "Socialistisk Folkeparti")
            socialistiskFolkeparti += c.votes

        if (c.party === "Liberal Alliance")
            liberalAlliance += c.votes

        if (c.party === "Kristendemokraterne")
            kristendemokraterne += c.votes

        if (c.party === "Lokallisten Gladsaxe")
            lokallistenGladsaxe += c.votes

        if (c.party === "Dansk Folkeparti")
            danskFolkeparti += c.votes

        if (c.party === "Venstre")
            venstre += c.votes

        if (c.party === "Enhedslisten")
            enhedslisten += c.votes

    })

    let electionNumbers = google.visualization.arrayToDataTable([
        ['Parti', 'Antal stemmere'],
        ['Socialdemokratiet', socialdemokratiet],
        ['Radikale Venstre', radikaleVenstre],
        ['Det Konservertive Folkeparti', detKonservertiveFolkeparti],
        ['Nye Borgerlige', nyeBorgerlige],
        ['Socialistisk Folkeparti', socialistiskFolkeparti],
        ['Liberal Alliance', liberalAlliance],
        ['Kristendemokraterne', kristendemokraterne],
        ['Lokallisten Gladsaxe', lokallistenGladsaxe],
        ['Dansk Folkeparti', danskFolkeparti],
        ['Venstre', venstre],
        ['Enhedslisten', enhedslisten]
    ]);

    let options = {'width': 700, 'height': 400};
    // Display the chart inside the <div> element with id="piechart"
    let chart = new google.visualization.PieChart(document.getElementById('piechart'));
    chart.draw(electionNumbers, options);
}
