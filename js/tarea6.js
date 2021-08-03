//Creacion del las 2 grafica
grafLine = d3.select('#grafLine')
grafLine2 = d3.select('#grafLine2')

//Calcula el ancho de la ventana cortando el px con el slice del valor ejemplo 1000px > 1000
anchoTotalLine = grafLine.style('width').slice(0, -2)
altoTotalLine = anchoTotalLine*1
anchoTotalLine2 = grafLine2.style('width').slice(0, -2)
altoTotalLine2 = altoTotalLine
// Configuracion el ancho y Largo del los grafs
grafLine.style('width', `${ anchoTotalLine }px`)
        .style('height', `${ altoTotalLine }px`)

grafLine2.style('width', `${ anchoTotalLine2 }px`)
         .style('height', `${ altoTotalLine2 }px`)        

//Definir la variable margen y definir los margenes a uasr em el SVG
margen  = { superior: 30, izquierdo: 65, derecho: 0, inferior: 60 }

//Calcular el ancho y alto del SVG
anchoLine = anchoTotalLine - margen.izquierdo - margen.derecho
altoLine  = altoTotalLine - margen.superior - margen.inferior
anchoLine2 = anchoTotalLine2 - margen.izquierdo - margen.derecho
altoLine2  = altoTotalLine2 - margen.superior - margen.inferior

// Configurar ancho y alto del SVGs que es igual al grafs
svgLine = grafLine.append('svg')
          .style('width', `${ anchoTotalLine }px`)
          .style('height', `${ altoTotalLine }px`)       
svgLine2 = grafLine2.append('svg')
           .style('width', `${ anchoTotalLine2 }px`)
           .style('height', `${ altoTotalLine2 }px`)             
       
// Configurar ancho y alto del G que es la area donde vamso a dibugar la grafica respetando los margenes 
gLine = svgLine.append('g')
       .attr('transform', `translate(${ margen.izquierdo }, ${ margen.superior })`)
       .attr('width', anchoLine + 'px')
       .attr('height', altoLine + 'px')
gLine2 = svgLine2.append('g')
       .attr('transform', `translate(${ margen.izquierdo }, ${ margen.superior })`)
       .attr('width', anchoLine2 + 'px')
       .attr('height', altoLine2 + 'px')


// Declarar escalador para bandas y lineal 
x = d3.scaleBand().range([0, anchoLine]).paddingInner(-0.3).paddingOuter(0.3) 
y = d3.scaleLinear().range([altoLine,0])

x2 = d3.scaleBand().range([0, anchoLine]).paddingInner(-0.3).paddingOuter(0.3) 
y2 = d3.scaleLinear().range([altoLine,0])

// Declaracion de los ejes X y Y globales para ser redibujados 
xAxisGroupLine = gLine.append('g')
              .attr('transform', `translate(0, ${ altoLine })`)
              .attr('class', 'eje')

xAxisGroupLine2 = gLine2.append('g')
              .attr('transform', `translate(0, ${ altoLine })`)
              .attr('class', 'eje')

              
yAxisGroupLine = gLine.append('g')
              .attr('class', 'eje')     

yAxisGroupLine2 = gLine2.append('g')
              .attr('class', 'eje')                


/******** TITULOS Y ETIQUETAS *************/            
tituloLine = gLine.append('text').attr('x', `${anchoLine / 2}px`).attr('y', '-5px').attr('text-anchor', 'middle').text('Muertes Diarias')
tituloLine2 = gLine2.append('text').attr('x', `${anchoLine / 2}px`).attr('y', '-5px').attr('text-anchor', 'middle').text('Casos Diarios')
          
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
  numMinY = d3.min(data, d => d.NewDeaths)
  numMaxY = d3.max(data, d => d.NewDeaths) 
  numMinY2 = d3.min(data, d => d.NewCases)
  numMaxY2 = d3.max(data, d => d.NewCases)     
  y.domain([numMinY,numMaxY])
  x.domain(data.map(d => d.date))
  y2.domain([numMinY2,numMaxY2])
  x2.domain(data.map(d => d.date))  
     
  /***** GRAFICA DE LINEAS Death *****/  
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
    
  /***** GRAFICA DE LINEAS Cases *****/  
  d3.select("#pathLine").transition()
    .duration(velocidadTransicion)
    .attr("d", d3.line()
      .x2(function(d) { return x2(d.date) })
      .y2(function(d) { return y2(0) }))
    .remove() 

  pathLine2= gLine2.append("path") 
    .datum(data)
    .attr("id", "pathLine") 
    .attr("fill", "none")
    .attr("stroke", "#4d99ca")
    .attr("stroke-width", 1.5)
    .attr("d", d3.line()
      .x2(function(d) { return x2(d.date) })
      .y2(function(d) { return y2(0) }))
    .transition().duration(velocidadTransicion)
    .attr("d", d3.line()
      .x2(function(d) { return x2(d.date) })
      .y2(function(d) { return y2(d.NewCases) }))  

  /***** Redibujar Ejes *****/
  yAxisCall = d3.axisLeft(y).ticks(10)
  yAxisGroup.transition().duration(velocidadTransicion).call(yAxisCall) 

  yAxisCallLine = d3.axisLeft(y).ticks(10)
  yAxisGroupLine.transition().duration(velocidadTransicion).call(yAxisCallLine)  

  yAxisCallLine2 = d3.axisLeft(y2).ticks(10)
  yAxisGroupLine2.transition().duration(velocidadTransicion).call(yAxisCallLine2)  

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
  xAxisGroupLine2.transition().duration(velocidadTransicion).call(xAxisCallLine2)
  xAxisCallLine2 = d3.axisBottom(x2)
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
  xAxisGroupLine2.transition().duration(velocidadTransicion).call(xAxisCallLine2)
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
        d.NewCases = +d.NewCases   
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
      d.NewCases = +d.NewCases
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

