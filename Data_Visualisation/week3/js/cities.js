// Run functions:
// onload
// on Selectbox change

const svg = d3.select("svg")

svg
    .attr("viewBox", "0 0 960 720")

const axisXGroup = svg  
    .append("g")
    .attr("class", "x-axis")
    .attr("transform", "translate(0, 640)")

const axisYGroup = svg  
    .append("g")
    .attr("class", "y-axis")
    .attr("transform", "translate(100, 20)")

const axisXText = svg  
    .append("text")
    .attr("class", "x-axis")
    .attr("transform", "translate(480,690)")
    .text("X-Axis")

const axisYText = svg  
    .append("text")
    .attr("class", "y-axis")
    .attr("transform", "translate(30,380) rotate(-90)")
    .text("Y-Axis")

const placeCities = function(){
    let inputX = document.querySelector("select[name=valueX]")
    let inputY = document.querySelector("select[name=valueY]")
    
    let valueX = inputX.value
    let valueY = inputY.value

    let textX = inputX.options[inputX.selectedIndex].innerHTML
    let textY = inputY.options[inputY.selectedIndex].innerHTML

    axisXText.text(textX)
    axisYText.text(textY)


    // find max value of the data

    let maxValueX = d3.max(data, (d,i) => {return d[valueX]} )
    let maxValueY = d3.max(data, (d,i) => {return d[valueY]} )
    let maxValueR = d3.max(data, (d,i) => {return d.population} )

    const scaleX = d3.scaleLinear()
        .domain([0, maxValueX])
        .range([100,860])

    const scaleY = d3.scaleLinear()
        .domain([0, maxValueY])
        .range([620,100])

    const scaleR = d3.scaleSqrt()
        .domain([0, maxValueR])
        .range([0,30])

    const axisX = d3.axisBottom(scaleX)
        .tickSizeInner(-520)
        .tickSizeOuter(0)
        .tickPadding(10)
        .ticks(10, "$,f")

    axisXGroup.call(axisX)

    const axisY = d3.axisLeft(scaleY)
        .tickSizeInner(-760)
        .tickSizeOuter(0)
        .tickPadding(10)
        .ticks(10, "$,f")

    axisYGroup.call(axisY)

    const cities = svg
        .selectAll("g.city") //create a group first (here everything will be entered afterwards with "cities")
        .data(data, (d,i) => {return d.city})
        .enter()
        .append("g")
        .attr("class", "city")
        .attr("transform", (d,i) => {
            const x = scaleX(d[valueX])
            const y = scaleY(d[valueY])
            return `translate(${x},${y})`
        })

    cities
        .append("circle")
        .attr("cx", 0)
        .attr("cy", 0)
        .attr("r", 0)
        .transition()
        .duration(400)
        .attr("r", (d,i) => {return scaleR(d.population)} )

    cities
        .append("rect")
        .attr("x", -60)
        .attr("y", (d,i) => {return -1 * scaleR(d.population)-35}) //make use od scale to position appropriately
        .attr("width", 120)
        .attr("height", 30)
    
    cities
        .append("text")
        .attr("x", 0)
        .attr("y", (d,i) => {return -1 * scaleR(d.population)-15}) //make use od scale to position appropriately
        .text((d,i)=>{return d.city})


    svg
        .selectAll("g.city")
        .transition()
        .duration(500)
        .attr("transform", (d,i) => {
            const x = scaleX(d[valueX])
            const y = scaleY(d[valueY])
            return `translate(${x},${y})`
        })

    svg
        .selectAll("g.city")
        .on("mouseover", function(){
            d3.select(this).raise()
        })
}

placeCities()

const selectTags = document.querySelectorAll("select")
selectTags.forEach((selectTag) => {
    selectTag.addEventListener("change", function(){
        placeCities()
    })
})