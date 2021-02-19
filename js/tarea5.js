//Creacion del las 2 grafica
graf = d3.select('#grafBoxPlot')
grafLine = d3.select('#grafLine')

//Calcula el ancho de la ventana cortando el px con el slice del valor ejemplo 1000px > 1000
ancho_total = graf.style('width').slice(0, -2)
alto_total = ancho_total * 2
anchoTotalLine = grafLine.style('width').slice(0, -2)
altoTotalLine = alto_total

// Configuracion el ancho y Largo del los grafs
graf.style('width', `${ ancho_total }px`)
    .style('height', `${ alto_total }px`)

grafLine.style('width', `${ anchoTotalLine }px`)
        .style('height', `${ altoTotalLine }px`)

//Definir la variable margen y definir los margenes a uasr em el SVG
margen  = { superior: 30, izquierdo: 65, derecho: 0, inferior: 60 }

//Calcular el ancho y alto del SVG
ancho = ancho_total - margen.izquierdo - margen.derecho
alto  = alto_total - margen.superior - margen.inferior
anchoLine = anchoTotalLine - margen.izquierdo - margen.derecho
altoLine  = altoTotalLine - margen.superior - margen.inferior

// Configurar ancho y alto del SVGs que es igual al grafs
svg = graf.append('svg')
          .style('width', `${ ancho_total }px`)
          .style('height', `${ alto_total }px`)
svgLine = grafLine.append('svg')
          .style('width', `${ anchoTotalLine }px`)
          .style('height', `${ altoTotalLine }px`)          
       
// Configurar ancho y alto del G que es la area donde vamso a dibugar la grafica respetando los margenes 
g = svg.append('g')
       .attr('transform', `translate(${ margen.izquierdo }, ${ margen.superior })`)
       .attr('width', ancho + 'px')
       .attr('height', alto + 'px')
gLine = svgLine.append('g')
       .attr('transform', `translate(${ margen.izquierdo }, ${ margen.superior })`)
       .attr('width', anchoLine + 'px')
       .attr('height', altoLine + 'px')

// Declarar escalador para bandas y lineal 
x = d3.scaleBand().range([0, anchoLine]).paddingInner(-0.3).paddingOuter(0.3) 
y = d3.scaleLinear().range([alto,0])

// Declaracion de los ejes X y Y globales para ser redibujados 
xAxisGroupLine = gLine.append('g')
              .attr('transform', `translate(0, ${ alto })`)
              .attr('class', 'eje')
              
yAxisGroup = g.append('g')
              .attr('class', 'eje')     

yAxisGroupLine = gLine.append('g')
              .attr('class', 'eje')     


/******** TITULOS Y ETIQUETAS *************/            
titulo = g.append('text').attr('x', `${ancho / 2}px`).attr('y', '-5px').attr('text-anchor', 'middle').text('Muertes Diarias')
tituloLine = gLine.append('text').attr('x', `${anchoLine / 2}px`).attr('y', '-5px').attr('text-anchor', 'middle').text('Muertes Diarias')
          
//Declaracion de Variables Globales    
pais = 'Mexico'
paisSelect = d3.select('#paisSelect')
listaPaises =[]
dataArray = []
valoresTickX=[]
velocidadTransicion=4000

/***** Funcion para hacer el render de la grafica *****/
function render(data) 
{
  /***** CALCULOS ESTADISTICOS******/
  numQ1 = d3.quantile(data.map(function(d) { return d.NewDeaths; }).sort(d3.ascending),.25)
  numMediana = d3.quantile(data.map(function(d) { return d.NewDeaths; }).sort(d3.ascending),.5)
  numQ3 = d3.quantile(data.map(function(g) { return g.NewDeaths; }).sort(d3.ascending),.75)
  numPromedio = d3.mean(data.map(function(d) { return d.NewDeaths; }).sort(d3.ascending))
  numIQR = numQ3 - numQ1
  numMin = numQ1-(1.5*numIQR)
  numMax = numQ3+(1.5*numIQR)
  numMinY = d3.min(data, d => d.NewDeaths)
  numMaxY = d3.max(data, d => d.NewDeaths) 
  numOutliner=numMaxY
  numMinDomain = 0
  numMaxDomain = 0
  if(numMin<numMinY) 
  {
    numMinDomain=numMinY
    numMin=numMinY
  }
  else
  {
    numMinDomain=numMinY
  }
  if(numMax<numMaxY) 
  {
    numMaxDomain=numMaxY
  }
  else
  {
    numMaxDomain=numMax
  }
  y.domain([numMinDomain,numMaxDomain])
  x.domain(data.map(d => d.date))
  console.log("numQ1:"+numQ1+" -> "+ y(numQ1))
  console.log("numMediana:"+numMediana+" -> "+y(numMediana) )
  console.log("numPromedio:"+numPromedio+" -> "+y(numPromedio) )
  console.log("numQ3:"+numQ3+" -> "+ y(numQ3))
  console.log("numIQR:"+numIQR+" -> "+y(numIQR) )
  console.log("numMin:"+numMin+" -> "+ y(numMin))
  console.log("numMax:"+numMax+" -> "+ y(numMax))
  console.log("numMinY:"+numMinY+" -> "+ y(numMinY))
  console.log("numMaxY:"+numMaxY+" -> "+ y(numMaxY))  
  console.log("y.domain:"+y.domain()[0]+","+y.domain()[1])  
  console.log("ALTURA CAJA:"+(numQ3-numQ1)+" -> "+(y(numQ1)-y(numQ3)))  
  d3.select('#txtMin').text("Mínimo: "+numMin)
  d3.select('#txtMax').text("Máximo: "+numMax)
  d3.select('#txtMediana').text("Mediana: "+numMediana)
  d3.select('#txtPromedio').text("Promedio: "+numPromedio)
  d3.select('#txtQ1').text("Cuartil 1 (Q1): "+numQ1)
  d3.select('#txtQ3').text("Cuartil 3 (Q3): "+numQ3)
  d3.select('#txtIQR').text("Rango Intercuartil (IQR): "+numIQR)
  d3.select('#txtOutliner').text("Maximo valor atipico: "+numOutliner)

  var anchoCaja = ancho/2
  var anchoBigote = anchoCaja/2
  var centroCaja = anchoCaja
  var x1Caja = anchoCaja/2
  var x2Caja = x1Caja+anchoCaja
  var x1Bigote = anchoCaja-(anchoBigote/2)
  var x2Bigote = x1Bigote+anchoBigote

  /***** BIGOTES *****/
  d3.select('#LineaVertical').transition()
    .duration(velocidadTransicion)
    .attr("x1", centroCaja)
    .attr("x2", centroCaja)
    .attr("y1", y(numMediana))
    .attr("y2", y(numMediana))
    .remove()
  LineaVertical = g.append('line')
    .attr("id", "LineaVertical")
    .attr("x1", centroCaja)
    .attr("x2", centroCaja)
    .attr("y1", y(numMediana))
    .attr("y2", y(numMediana))
    .attr("stroke", "black")
    .style("width", anchoBigote)
    .transition().duration(velocidadTransicion)  
    .attr("y1", y(numMin))
    .attr("y2", y(numMax))

  d3.select('#LineaHorizontalArriba').transition()
    .duration(velocidadTransicion)
    .attr("x1", centroCaja)
    .attr("x2", centroCaja)
    .attr("y1", y(numMediana))
    .attr("y2", y(numMediana))
    .remove()
  LineaHorizontalArriba = g.append('line')
    .attr("id", "LineaHorizontalArriba")
    .attr("x1", centroCaja)
    .attr("x2", centroCaja)
    .attr("y1", y(numMediana))
    .attr("y2", y(numMediana))
    .attr("stroke", "black")
    .style("width", anchoBigote)  
    .transition().duration(velocidadTransicion)
    .attr("x1", x1Bigote)
    .attr("x2", x2Bigote)       
    .attr("y1", y(numMax))
    .attr("y2", y(numMax))     
   
  d3.select('#LineaHorizontalAbajo').transition()
    .duration(velocidadTransicion)
    .attr("x1", centroCaja)
    .attr("x2", centroCaja)
    .attr("y1", y(numMediana))
    .attr("y2", y(numMediana))
    .remove()    
  LineaHorizontalAbajo = g.append("line")
    .attr("id", "LineaHorizontalAbajo")
    .attr("x1", centroCaja)
    .attr("x2", centroCaja)
    .attr("y1", y(numMediana))
    .attr("y2", y(numMediana))
    .attr("stroke", "black")
    .style("width", anchoBigote)      
    .transition().duration(velocidadTransicion)
    .attr("x1", x1Bigote)
    .attr("x2", x2Bigote)
    .attr("y1", y(numMin))
    .attr("y2", y(numMin))      

  /***** CAJA ******/
  d3.select("#caja").transition()
    .duration(velocidadTransicion)
    .attr("x", ancho/2)
    .attr("y", y(numMediana))
    .attr("height", 0)
    .attr("width", 0 )
    .remove()    
  caja = g.append("rect")
      .attr("id", "caja")
      .attr("x", centroCaja)
      .attr("y", y(numMediana))
      .attr("height", 0)
      .attr("width", 0 )
      .attr("stroke", "black")
      .attr("fill", "#afd1e7") 
      .transition().duration(velocidadTransicion)  
      .attr("x", x1Caja)
      .attr("y", y(numQ3))
      .attr("height", y(numQ1)-y(numQ3))
      .attr("width", anchoCaja )


  /***** MEDIANA  *****/ 
  d3.select("#mediana").transition()
    .duration(velocidadTransicion)
    .attr("x1", centroCaja)
    .attr("x2", centroCaja)
    .attr("y1", y(numMediana))
    .attr("y2", y(numMediana))
    .remove()     
  mediana = g.append("line")
    .attr("id", "mediana")
    .attr("x1", centroCaja)
    .attr("x2", centroCaja)
    .attr("y1", y(numMediana))
    .attr("y2", y(numMediana))
    .attr("stroke", "#4d99ca")
    .attr("stroke-width", 0)   
    .transition().duration(velocidadTransicion) 
    .attr("x1", x1Caja)
    .attr("x2", x2Caja)    
    .attr("stroke-width", 2) 
  //mediana.exit().remove() 

  /***** OUTLINERS  *****/  
  var jitterWidth = anchoBigote
  puntos = g.selectAll("circle").data(data,d => d.country)
  puntos.enter()
  .append("circle")
  .filter(function(d){ return d.NewDeaths>numMax || d.NewDeaths<numMin ; })
    .attr("cx", centroCaja)
    .attr("cy", y(numMediana))
    .attr("r", 0)
    .style("fill", "#afd1e7")
    .attr("stroke", "#4d99ca") 
    .transition().duration(velocidadTransicion)  
    .attr("r", 2) 
    .attr("cx", function(d){return(centroCaja - jitterWidth/2 + Math.random()*jitterWidth )})
    .attr("cy", function(d){return(y(d.NewDeaths))})      
  puntos.exit()
      .transition()
      .duration(velocidadTransicion)
      .attr("cx", centroCaja)
      .attr("cy", y(numMediana))
      .attr("r", 0)
      .remove() 
   
  /***** GRAFICA DE LINEAS  *****/  
  d3.select("#pathLine").transition()
    .duration(velocidadTransicion)
    .attr("d", d3.line()
      .x(function(d) { return x(d.date) })
      .y(function(d) { return y(0) }))
    .remove() 

  pathLine= gLine.append("path") 
    .datum(data)
    .attr("id", "pathLine") 
    .attr("fill", "none")
    .attr("stroke", "#4d99ca")
    .attr("stroke-width", 1.5)
    .attr("d", d3.line()
      .x(function(d) { return x(d.date) })
      .y(function(d) { return y(0) }))
    .transition().duration(velocidadTransicion)
    .attr("d", d3.line()
      .x(function(d) { return x(d.date) })
      .y(function(d) { return y(d.NewDeaths) }))       
    
  /***** Redibujar Ejes *****/
  yAxisCall = d3.axisLeft(y).ticks(10)
  yAxisGroup.transition().duration(velocidadTransicion).call(yAxisCall) 

  yAxisCallLine = d3.axisLeft(y).ticks(10)
  yAxisGroupLine.transition().duration(velocidadTransicion).call(yAxisCallLine)  

  xAxisCallLine = d3.axisBottom(x)
                    .tickValues(valoresTickX)
                    .tickFormat(function(n) 
                      {
                        varDia = n.split("/")
                        varMes = ''
                        switch(varDia[0])
                          {
                            case '1':
                              varMes='Ene'
                              break;
                            case '2':
                              varMes='Feb'
                              break;
                            case '3':
                              varMes='Mar'
                              break;
                            case '4':
                              varMes='Abr'
                              break;                                                                                    
                            case '5':
                              varMes='May'
                              break;                                
                            case '6':
                              varMes='Jun'
                              break;                                
                            case '7':
                              varMes='Jul'
                              break;
                            case '8':
                              varMes='Ago'
                              break;
                            case '9':
                              varMes='Sep'
                              break;
                            case '10':
                              varMes='Oct'
                              break;                                                                                    
                            case '11':
                              varMes='Nov'
                              break;                                
                            case '12':
                              varMes='Dic'
                              break;                                                          
                            }
                        return varMes +'-'+varDia[2]
                      })                                       
  xAxisGroupLine.transition().duration(velocidadTransicion).call(xAxisCallLine)
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
        d.NewDeaths = +d.NewDeaths      
      }) 
    PaisesData = d3.map(data,function(d){return d.country;})
    listaPaises = PaisesData.filter((v, i, a) => a.indexOf(v) === i)
    console.log("listaPaises:"+listaPaises.length)  
    listaPaises.forEach(d => 
      {
        paisSelect.append('option')
                    .attr('value', d)
                    .text(d)
      })
    dataArray = data
    frame() 
  })
/*****/

/***** Funcion para calcular los dominios dependiendo de la metrica a usar */  
function frame() 
{
  /***** Filtra por pais *****/  
  dataframe = dataArray.filter(function(d)
  { 
    return d.country === pais 
  }) 
  dataframe.forEach(d => 
    {
      /***** Convertir a numercos *****/
      d.NewDeaths = +d.NewDeaths
      varDia = d.date.split("/")
      if(varDia[1] == '1' )
      {
        valoresTickX.push(d.date)
      }        
    })     
  render(dataframe)  
}

paisSelect.on('change', () => 
{
  pais = paisSelect.node().value
  console.log("************* "+pais+" *************") 
  frame()
})

