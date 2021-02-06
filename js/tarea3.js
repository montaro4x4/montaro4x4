//Creacion del la grafica
graf = d3.select('#graf')
//Calcula el ancho de la ventana cortando el px con el slice del valor ejemplo 1000px > 1000
ancho_total = graf.style('width').slice(0, -2)
//Calcula el alto  con una relacion de 6:16 basado en el ancho 
alto_total = ancho_total * 9 / 16

// Configuracion el ancho y Largo del graf 
graf.style('width', `${ ancho_total }px`)
    .style('height', `${ alto_total }px`)

//Definir la variable margen y definir los margenes a uasr em el SVG
margen  = { superior: 30, izquierdo: 65, derecho: 15, inferior: 60 }

//Calcular el ancho y alto del SVG
ancho = ancho_total - margen.izquierdo - margen.derecho
alto  = alto_total - margen.superior - margen.inferior

// Configurar ancho y alto del SVG que es igual al graf
svg = graf.append('svg')
          .style('width', `${ ancho_total }px`)
          .style('height', `${ alto_total }px`)
       
// Configurar ancho y alto del G que es la area donde vamso a dibugar la grafica respetando los margenes 
g = svg.append('g')
       .attr('transform', `translate(${ margen.izquierdo }, ${ margen.superior })`)
       .attr('width', ancho + 'px')
       .attr('height', alto + 'px')

// Declarar escalador lineal como variable global para re dibujar segun estadistica seleccionada       
x = d3.scaleLinear().range([0,ancho])

// Declarar escalador para bandas como variable global para re dibujar segun estadistica seleccionada configurado a -0.3 de ancho para que sea mas grafica de area 
y = d3.scaleBand()
      .range([alto, 0])
      .paddingInner(0.3)
      .paddingOuter(0.3) 

var timeScale
// Declaracion de los ejes X y Y globales para ser redibujados 
xAxisGroup = g.append('g')
              .attr('transform', `translate(0, ${ alto })`)
              .attr('class', 'eje')
              
yAxisGroup = g.append('g')
              .attr('class', 'eje')       

//Declaracion de Titulo Inicial               
titulo = g.append('text')
          .attr('x', `${ancho / 2}px`)
          .attr('y', '-5px')
          .attr('text-anchor', 'middle')
          .text('')

//Declaracion de Variables Globales           
dataArray = []
valoresTickX=[]
maxY=0
maxX=0
var sliderMax
var sliderMin
var parseTime = d3.timeParse("%m/%d/%y")
var filterDate= parseTime("1/21/20")

var color = d3.scaleOrdinal(d3.schemeCategory10)
//.range(["orange", "steelblue"])

//Declara metrica Inicial 
slider     = d3.select('#slider');

/***** Funcion para hacer el render de la grafica *****/
function render(data) 
{
  barras = g.selectAll('rect').data(data, d => d.TotalDeaths)
  barras.enter()
        .append('rect')
        .attr('y', function(d) { return y(d.country); }) 
        .attr('x', function(d) { return x(0);}) 
        .attr('width', function(d) {return x(d.TotalDeaths); })
        .attr('height', y.bandwidth())
        .attr('fill', function(d) {return color(d.country);})
  barras.transition()
        .duration(500)
        .style('y', function(d) { return y(d.country); })
        .style('width', function(d) {return x(d.TotalDeaths); } )  
        .attr('fill', function(d) {return color(d.country);})
  barras.exit().remove()
       
  barrasCountry = g.selectAll('text.label').data(data, d => d.country)
  barrasCountry.enter()
               .append('text')
               .attr('class', 'label')
               .attr('x', function(d) {return x(d.TotalDeaths)-8;})
               .attr('y', function(d) {return y(d.country)+20;})
               .style('text-anchor', 'end')
               .style('fill', '#000000')
               .html(d => d.country);       
  barrasCountry.transition()
               .duration(20)
               .attr('x', function(d) {return x(d.TotalDeaths)-8;})
               .attr('y', function(d) {return y(d.country)+20;})  
  barrasCountry.raise()                
  barrasCountry.exit().remove()


  //console.log("3 Eje Y")
  yAxisCall = d3.axisLeft(y)
                .ticks(15)               
  yAxisGroup.transition()
            .duration(500)
            .call(yAxisCall)
  //console.log("4 - Eje X")
  xAxisCall = d3.axisBottom(x)
  
  console.log("5")
  xAxisGroup
  .transition()
            .duration(500)
            .call(xAxisCall)
            .selectAll('text')
            .attr('x', '18px')
            .attr('y', '20px')
            .attr('text-anchor', 'end')
  //          .attr('transform', 'rotate(-90)')
  /*****/
  //console.log("6")
  /****** CAMBIA EL TITULO SEGUN LA METRICA Y AGREGA LOS DATOS RECORDS  */
  titulo.transition()
        .duration(2000)
        .attr('x', `${ancho / 2}px`)
        .attr('y', '0px')
        .attr('text-anchor', 'middle')
        .text('Muertes Acumuladas')
        .attr('class', 'titulo-grafica') 
  //console.log("7")

}
/*****/

/********************************** Carga del Dataset ***********************************/
d3.csv('dataset/covid19World.csv')
  .then(function(data) 
  {
    /***** Ciclo de todos los registros *****/
    console.log("Todos:"+data.length); 
    data.forEach(d => 
      {
        /***** Convertir a numercos *****/
        d.Population = +d.Population
        d.NewCases = +d.NewCases
        d.TotalCases = +d.TotalCases
        d.NewDeaths = +d.NewDeaths
        d.TotalDeaths = +d.TotalDeaths
        d.dateString = parseTime(d.date);        
        /***** Convertir a fecha *****/
        d.date = parseTime(d.date);        
      })      
    /***** INICIA SLIDER *****/
    sliderMin = d3.min(data, d => d.date)  
    sliderMax = d3.max(data, d => d.date)
    //console.log("sliderMin:"+sliderMin)
    //console.log("sliderMax:"+sliderMax)
    var Difference_In_Time = sliderMax - sliderMin; 
    var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
    //console.log("Difference_In_Days:"+Difference_In_Days)
    //filterDate = sliderMin
    filterDate = parseTime("10/21/20")
    timeScale = d3.scaleTime()      
      .domain([sliderMin,sliderMax])
      .range([0,Difference_In_Days]); 

    color.domain(d3.map(data, d => d.country))
    //console.log("timeScale_Min:"+timeScale(sliderMin))    
    //console.log("timeScale_filterDate:"+timeScale(filterDate))  
    //console.log("timeScale_Max:"+timeScale(sliderMax))  
    slider.attr('min', timeScale.range()[0])
          .attr('max', timeScale.range()[1])
    slider.node().value = timeScale(filterDate)
    //console.log("sliderNode:"+slider.node().value)    
    dataArray = data    
    frame()
  })
/*****/

/***** Funcion para calcular los dominios dependiendo de la metrica a usar */  
function frame() 
{
  /***** Filtra por dia *****/  
  console.log("Filter");      
  console.log("filterDate:"+filterDate);  
  dataframe = dataArray.filter(function(d)
  { 
    return d.date.getTime() === filterDate.getTime() 
  })   
  console.log("Filter:"+dataframe.length);    
  /***** Ordena y trae las 15 mas altas *****/  
  console.log("Sort");    
  dataframe = dataframe.sort(function(a,b) 
  {
    return d3.descending(a.TotalDeaths,b.TotalDeaths);
  }).slice(0, 15);//las 15 mas altas
  console.log("Sort:"+dataframe.length); 
  // Asigna data a Variable Global para ser usada en otras funciones 
  dataframe = dataframe.sort(function(a,b) 
  {
    return d3.ascending(a.TotalDeaths,b.TotalDeaths);
  });  
  //Definimos el dominio de X y Y
  maxX = d3.max(dataframe, d => d.TotalDeaths)
  //Definimos el dominio de X y Y
  y.domain(dataframe.map(d => d.country))  
  x.domain([0, maxX])
  console.log("Termina Frame")  
  render(dataframe)
}
    
slider.on('input', () => 
{
  console.log("Slider");
  SliderNode = +slider.node().value
  console.log("Slider Node:"+SliderNode);    
  console.log("Slider Node INVERTED:"+timeScale.invert(SliderNode));    
  filterDate = timeScale.invert(SliderNode)
  console.log("filterDate:"+filterDate); 
  filterDate.setHours(0)
  console.log("filterDate_Rounded:"+filterDate); 
  frame()
})
    
 

