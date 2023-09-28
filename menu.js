/*Notes

CS 416 Narrative Visualization
Casey Rodgers

References
- https://www.w3schools.com/howto/howto_js_tabs.asp

*/

function openTab(evt, idName) {
    //console.log("hi");
    // Get tab conent
    var i, tabcontent, navlink;
    tabcontent = document.getElementsByClassName("tabcontent");
    //console.log("hi2");
    
    // Set display of all tab content to non
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    
    // Reset active button
    navlink = document.getElementsByClassName("navlink");
    for (i = 0; i < navlink.length; i++) {
        navlink[i].className = navlink[i].className.replace(" active", "");
    }
    
    // Turn on active tab content and button
    document.getElementById(idName).style.display = "block";
    evt.currentTarget.className += " active";

    // Get rid of tooltip and info tab
    document.getElementById("tooltip").style.opacity = "0";
    document.getElementById("information").innerHTML = "";
    
    // Reset line opacities and annotations
    d3.selectAll(".line").style("opacity", 1);
    d3.selectAll(".lineGenre").style("opacity", 1);
    d3.select(".annotation-group").remove();
    
    // Fill beginning text
    var begin_text = document.getElementById("beginning");
    if (idName == "byOverview"){
        begin_text.innerHTML = "<p>Over time, video games have become increasingly popular with the advancement of technology. There was a huge spike around 2008 with a decrease afterwards. This decrease could be due to the data not being updated and / or current sales. Click on the line to bring up total global sales over time and the top selling video games!</p>";
        
    } else if (idName == "byPlatform"){
        begin_text.innerHTML = "<p>Looking at the data separated by console can help us understand how different consoles have performed in the past. It can also help us see what consoles have been released and by which companies. We can see that Nintendo has gone very strong since the beginning basically, while other companies like Sega haven't released any new consoles that have done well recently. Click on a line to bring up total global sales over time and the top games in that console!</p>";
        
    } else if (idName == "byGenre"){
        begin_text.innerHTML = "<p>We can also look at the sales data separated by video game genre. We can see that the action and sports genres are very popular, while other genres like puzzle and strategy aren't. Click on a line to bring up total global sales over time and the top games in that genre!</p>";
    }
    
}