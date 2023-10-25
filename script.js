const vowelToCountMap = new Map();

function count() {
  vowelToCountMap.clear();
  const str = document.getElementById("wordbox").value;
  const strLower = str.toLowerCase();

  const vowels = "aeiouy";
  const consonants = "bcdfghjklmnpqrstvwxz";
  const punctuation = ".,;!?@#$%^&*()/";

  let vowelCount = 0;
  let consonantCount = 0;
  let punctuationCount = 0;

  for (let i = 0; i < strLower.length; i++) {
    const char = strLower[i];
    if (vowels.includes(char)) {
      vowelCount++;
    } else if (consonants.includes(char)) {
      consonantCount++;
    } else if (punctuation.includes(char)) {
      punctuationCount++;
    }
  }

  const data = [
    { name: "Vowels", share: vowelCount },
    { name: "Consonants", share: consonantCount },
    { name: "Punctuation", share: punctuationCount },
  ];

  for (const [key, value] of vowelToCountMap.entries()) {
    console.log(`${key} = ${value}`);
  }

  d3.select("#countText").text("");
  d3.select("svg").selectAll("*").remove();

  const width = 580;
  const height = 500;
  const svg = d3.select("svg").attr("width", width).attr("height", height);
  const radius = 200;
  const halfWidth = width / 2;
  const halfHeight = height / 2;

  let g = svg
    .append("g")
    .attr("transform", `translate(${halfWidth}, ${halfHeight})`);

  let ordScale = d3.scaleOrdinal(d3.schemeSet3).domain(data.map((d) => d.name));

  let pie = d3.pie().value(function (d) {
    return d.share;
  });

  let arc = g.selectAll("arc").data(pie(data)).enter();

  let path = d3
    .arc()
    .innerRadius(radius - 75)
    .outerRadius(radius);

  const arcs = arc
    .append("path")
    .attr("d", path)
    .attr("fill", function (d) {
      return ordScale(d.data.name);
    })
    .attr("stroke", "black")
    .attr("stroke-width", 1);

  const text = svg.append("text").attr("x", halfWidth).attr("y", halfHeight);

  arcs
    .on("mouseover", function (event, d) {
      d3.select(this).attr("stroke-width", 4);

      const countText = d3.select("text");
      const type = d.data.name;
      const count = d.data.share;

      countText.text(`${type}: ${count}`);
      const textHalfWidth = countText.node().getBBox().width / 2;
      countText.attr("x", halfWidth - textHalfWidth);
    })
    .on("mouseout", function () {
      d3.select(this).attr("stroke-width", 1);

      const countText = d3.select("text");
      countText.text("");
    });

  arcs.on("click", function (event, d) {
    const selectedArcName = d.data.name;
    const selectedArcData = [];

    const strLower = document.getElementById("wordbox").value.toLowerCase();

    if (selectedArcName === "Vowels") {
      const vowels = "aeiouy";
      for (const char of vowels) {
        const count = strLower.split(char).length - 1;
        if (count > 0) {
          selectedArcData.push({ name: char, count: count });
        }
      }
    } else if (selectedArcName === "Consonants") {
      const consonants = "bcdfghjklmnpqrstvwxz";
      for (const char of consonants) {
        const count = strLower.split(char).length - 1;
        if (count > 0) {
          selectedArcData.push({ name: char, count: count });
        }
      }
    } else if (selectedArcName === "Punctuation") {
      const punctuation = ".,;!?@#$%^&*()/";
      for (const char of punctuation) {
        const count = strLower.split(char).length - 1;
        if (count > 0) {
          selectedArcData.push({ name: char, count: count });
        }
      }
    }

    if (selectedArcData.length > 0) {
      createBarChart(selectedArcData, selectedArcName);
    }
  });

  function createBarChart(data) {
    const barChartContainer = d3.select("#bar_div");
    barChartContainer.select("svg").selectAll("*").remove();

    const width = 500;
    const height = 500;
    const svg = barChartContainer
      .select("svg")
      .attr("width", width)
      .attr("height", height);

    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand().range([0, innerWidth]).padding(0.1);
    const y = d3.scaleLinear().range([innerHeight, 0]);

    x.domain(data.map((d) => d.name));
    y.domain([0, d3.max(data, (d) => d.count)]);

    g.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x));

    g.append("g").call(d3.axisLeft(y));

    const ordScale = d3
      .scaleOrdinal(d3.schemeSet3)
      .domain(data.map((d) => d.name));

    g.selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => x(d.name))
      .attr("y", (d) => y(d.count))
      .attr("width", x.bandwidth())
      .attr("height", (d) => innerHeight - y(d.count))
      .attr("fill", (d) => ordScale(d.name)); // Set fill color based on the ordScale

    g.selectAll(".bar-label")
      .data(data)
      .enter()
      .append("text")
      .attr("class", "bar-label")
      .attr("x", (d) => x(d.name) + x.bandwidth() / 2)
      .attr("y", (d) => y(d.count) - 5)
      .attr("text-anchor", "middle")
      .text((d) => d.count);
  }
}

document.getElementById("countBtn").onclick = count;