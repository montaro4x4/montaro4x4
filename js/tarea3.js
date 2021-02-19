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
x = d3.scaleLinear().range([0,ancho-70])

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
              .attr('class', 'ejeY')     

/******** TITULOS Y ETIQUETAS *************/            
titulo = g.append('text').attr('x', `${ancho / 2}px`).attr('y', '-5px').attr('text-anchor', 'middle').text('Muertes Acumuladas: ')

g.append('text').attr('x', `-30 px`).attr('y', '30px').attr('text-anchor', 'middle').text('1')    
g.append('text').attr('x', `-30 px`).attr('y', '65px').attr('text-anchor', 'middle').text('2')    
g.append('text').attr('x', `-30 px`).attr('y', '100px').attr('text-anchor', 'middle').text('3')    
g.append('text').attr('x', `-30 px`).attr('y', '135px').attr('text-anchor', 'middle').text('4')    
g.append('text').attr('x', `-30 px`).attr('y', '170px').attr('text-anchor', 'middle').text('5')    
g.append('text').attr('x', `-30 px`).attr('y', '205px').attr('text-anchor', 'middle').text('6')    
g.append('text').attr('x', `-30 px`).attr('y', '240px').attr('text-anchor', 'middle').text('7')    
g.append('text').attr('x', `-30 px`).attr('y', '275px').attr('text-anchor', 'middle').text('8')    
g.append('text').attr('x', `-30 px`).attr('y', '310px').attr('text-anchor', 'middle').text('9')    
g.append('text').attr('x', `-30 px`).attr('y', '345px').attr('text-anchor', 'middle').text('10')    
g.append('text').attr('x', `-30 px`).attr('y', '380px').attr('text-anchor', 'middle').text('11')    
g.append('text').attr('x', `-30 px`).attr('y', '415px').attr('text-anchor', 'middle').text('12')    
g.append('text').attr('x', `-30 px`).attr('y', '450px').attr('text-anchor', 'middle').text('13')    
g.append('text').attr('x', `-30 px`).attr('y', '485px').attr('text-anchor', 'middle').text('14')    
g.append('text').attr('x', `-30 px`).attr('y', '520px').attr('text-anchor', 'middle').text('15')    

fecha = g.append('text').attr('x', `${ancho -(ancho / 3)}px`).attr('y',`${alto - 40}px`).attr('text-anchor', 'start').attr('fill','#cccccc').attr('font-size','60').text('')

          
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
var interval
var corriendo=true
var velocidad=300
var velocidadTransicion=300
var TextoFecha
var formatTime = d3.timeFormat("%d-%b-%y");
botonPausa = d3.select('#pausa')

//Declara metrica Inicial 
slider     = d3.select('#slider');

/***** Funcion para hacer el render de la grafica *****/
function render(data) 
{
  barras = g.selectAll('rect').data(data, d => d.country)
  barras.enter()
        .append('rect')
          .attr('y', function(d) { return y(d.country); }) 
          .attr('x', function(d) { return x(0);}) 
          .attr('width', function(d) {return x(d.TotalDeaths); })
          .attr('height', y.bandwidth())
          .attr('fill', function(d) {return color(d.country);})
        .merge(barras)
          .transition().duration(velocidadTransicion)
          .attr('y', function(d) { return y(d.country); })
          .attr('width', function(d) {return x(d.TotalDeaths); } )  
          .attr('fill', function(d) {return color(d.country);})        
  barras.exit().remove()
       
  barrasCountry = g.selectAll('text.label').data(data, d => d.country)
  barrasCountry.enter()
               .append('text')
               .attr('class', 'label')
               .attr('x', function(d) {return x(d.TotalDeaths)+8;})
               .attr('y', function(d) {return y(d.country)+10;})
               .style('text-anchor', 'start')
               .style('fill', '#000000')
               .style('font-weight','400')
               .text(d => d.country);       
  barrasCountry.transition()
               .duration(velocidadTransicion)
               .attr('x', function(d) {return x(d.TotalDeaths)+8;})
               .attr('y', function(d) {return y(d.country)+10;})  
  barrasCountry.raise()                
  barrasCountry.exit().remove()

  barrasMuertos = g.selectAll('text.labelM').data(data, d => d.country)
  barrasMuertos.enter()
               .append('text')
               .attr('class', 'labelM')
               .attr('x', function(d) {return x(d.TotalDeaths)+8;})
               .attr('y', function(d) {return y(d.country)+23;})
               .style('text-anchor', 'start')
               .style('fill', '#000000')
               .style('font-weight','300')
               .attr('font-size','10')
               .text(d => d.TotalDeaths)       
  barrasMuertos.transition()
               .duration(velocidadTransicion)
               .text(d => d.TotalDeaths) 
               .attr('x', function(d) {return x(d.TotalDeaths)+8;})
               .attr('y', function(d) {return y(d.country)+23;})  
  barrasMuertos.raise()                
  barrasMuertos.exit().remove()

  /*barrasMuertos = g.selectAll('text.label1').data(data, d => d.TotalDeaths)
  barrasMuertos.enter()
               .append('text')
                .attr('class', 'label1')
                .attr('x', function(d) {return x(d.TotalDeaths)+8;})
                .attr('y', function(d) {return y(d.country)+23;})
                .style('text-anchor', 'start')
                .style('fill', '#000000')
                .style('font-weight','300')
                .attr('font-size','10')
                .html(d => d.TotalDeaths)    
               .transition()
                .duration(velocidadTransicion)
                .attr('x', function(d) {return x(d.TotalDeaths)+8;})
                .attr('y', function(d) {return y(d.country)+23;})  
  barrasMuertos.raise()                
  barrasMuertos.exit().remove()*/

  //console.log("3 Eje Y")
  /*yAxisCall = d3.axisLeft(y)
                .ticks(15)               
  yAxisGroup.transition()
            .duration(20)
            .call(yAxisCall)*/
  //console.log("4 - Eje X")
  xAxisCall = d3.axisBottom(x)
  
  console.log("5")
  xAxisGroup.transition()
            .duration(velocidadTransicion)
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
        .duration(velocidadTransicion)
        .attr('x', `${ancho / 2}px`)
        .attr('y', '0px')
        .attr('text-anchor', 'middle')
        .text('Muertes Acumuladas: '+Acumulado)
        .attr('class', 'titulo-grafica') 
  
  fecha.transition()
  .duration(velocidadTransicion)
  .text(TextoFecha)

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
    console.log("sliderMin:"+sliderMin)
    console.log("sliderMax:"+sliderMax)
    var Difference_In_Time = sliderMax - sliderMin; 
    var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
    //console.log("Difference_In_Days:"+Difference_In_Days)
    filterDate = sliderMin
    //filterDate = parseTime("10/21/20")
    timeScale = d3.scaleTime()      
      .domain([sliderMin,sliderMax])
      .range([0,Difference_In_Days]); 

    color.domain(d3.map(data, d => d.country))
    //console.log("timeScale_Min:"+timeScale(sliderMin))    
    //console.log("timeScale_filterDate:"+timeScale(filterDate))  
    //console.log("timeScale_Max:"+timeScale(sliderMax))  
    slider.attr('min', timeScale.range()[0])
          .attr('max', timeScale.range()[1])
    slider.node().value = timeScale(sliderMin)
    //console.log("sliderNode:"+slider.node().value)    
    dataArray = data    
    frame()
    interval = d3.interval(() => adelante(), velocidad)
  })
/*****/

/***** Funcion para calcular los dominios dependiendo de la metrica a usar */  
function frame() 
{
  /***** Filtra por dia *****/  
  console.log("Filter");      
  console.log("filterDate:"+filterDate);  
  console.log("filterDate.getTime():"+filterDate.getTime());  
  varFilterMin=+filterDate.getTime()-3601000
  varFilterMax=+filterDate.getTime()+3601000
  console.log("varFilterMin: "+varFilterMin);  
  console.log("varFilterMax: "+varFilterMax);  
  dataframe = dataArray.filter(function(d)
  { 
    return d.date.getTime() >= varFilterMin &&  d.date.getTime() <= varFilterMax
  })   
  console.log("Filter:"+dataframe.length);    
  Acumulado = d3.sum(dataframe, d => d.TotalDeaths)
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
  TextoFecha = formatTime(d3.max(dataframe, d => d.date))
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
  //filterDate.setHours(0)
  console.log("filterDate_Rounded:"+filterDate); 
  frame()
})

adelante
 
botonPausa.on('click', () => 
{
  corriendo = !corriendo
  if (corriendo) 
  {
    if (slider.node().value == timeScale(sliderMax))
      slider.node().value = 0
    botonPausa
      .classed('btn-danger', true)
      .classed('btn-success', false)
      .html('<i class="fas fa-pause-circle"></i>')
      interval = d3.interval(() => adelante(), velocidad)
  } 
  else 
  {
    botonPausa
      .classed('btn-danger', false)
      .classed('btn-success', true)
      .html('<i class="fas fa-play-circle"></i>')
    interval.stop()
  }
})

function adelante() 
{
  console.log("adelante:"); 
  console.log("slider.node().value:"+slider.node().value);
  console.log("timeScale(sliderMax):"+timeScale(sliderMax)); 
   if (slider.node().value == timeScale(sliderMax))
   { 
    console.log("llego al maximo"); 
    //filterDate = timeScale.invert(0)
    corriendo = !corriendo    
    botonPausa
      .classed('btn-danger', false)
      .classed('btn-success', true)
      .html('<i class="fas fa-play-circle"></i>')    
    interval.stop()
   }
   else
   {
     console.log("else"); 
     varNewFilterDate = +slider.node().value + 1 
     console.log("varNewFilterDate:"+varNewFilterDate); 
     filterDate=timeScale.invert(varNewFilterDate)
     //filterDate.setHours(0)
     slider.node().value = varNewFilterDate
   }
   frame()
}

