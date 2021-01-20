//Creacion del la grafica
graf = d3.select('#graf')
//Calcula el ancho de la ventana cortando el px con el slice del valor ejemplo 1000px > 1000
ancho_total = graf.style('width').slice(0, -2)
//Calcula el alto  con una relacion de 9:16 basado en el ancho 
alto_total = ancho_total * 7 / 16

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
y = d3.scaleLinear()
          .range([alto, 0])

// Declarar escalador para bandas como variable global para re dibujar segun estadistica seleccionada configurado a -0.3 de ancho para que sea mas grafica de area 
x = d3.scaleBand()
      .range([0, ancho])
      .paddingInner(-0.3)
      .paddingOuter(0.3) 
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
maxy=0

//Declara metrica Inicial 
metrica = 'TotalDeaths'
metricaSelect = d3.select('#metrica')

/***** Funcion para hacer el render de la grafica *****/
function render(data) 
{
  // Crea las barras de cada una de las barras
  barras = g.selectAll('rect')
            .data(data, d => d.date)

  // Crea cada una de las barras
  barras.enter()
        /***** Crea rectangulo como tiene transicion empieza en 0 para ir creciendo */
        .append('rect') // Creo Rectangulo
        .style('width', '0px')
        .style('height', '0px')
        .style('y', `${y(0)}px`) 
        .style('fill', '#000')
        .style('x', d => x(d.date) + 'px')
        /*****/

        /***** Hacemos trancision para animacion */
        .merge(barras)
        .transition()
        .ease(d3.easeElastic)
        .duration(2000)
        /*****/

        /***** Creamos el rectangulo final de la transicion con los datos reales  */
        .style('x', d => x(d.date) + 'px')
        .style('y', d => (y(d[metrica])) + 'px')
        .style('height', d => (alto - y(d[metrica])) + 'px')
        .style('width', d => `${x.bandwidth()}px`)
        // Cambia color rojo para muertes y Negro para contagios
        .style('fill', function(n)
        {
          //console.log(metrica)
          if(metrica=='TotalDeaths' || metrica=='NewDeaths')
          {
            //console.log('Entro')
            return '#FF0000'
          }
          else
          {
            //console.log('Else')
            return '#000000'
          }  
        })         
      
  // Borrar barras
  barras.exit()
        .transition()
        .duration(2000)
        .style('height', '0px')
        .style('y', d => `${y(0)}px`)
        .style('fill', '#000000')
        .remove()

  //Redibujar Ejes
  yAxisCall = d3.axisLeft(y)
                .ticks(3)

  yAxisGroup.transition()
            .duration(2000)
            .call(yAxisCall)

  xAxisCall = d3.axisBottom(x)
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
                    //console.log(varMes)
                    return varMes +'-'+varDia[2]
                  })
                //.tickFormat(d3axis.timeFormat("%m"))

  xAxisGroup.transition()
            .duration(2000)
            .call(xAxisCall)
            .selectAll('text')
            .attr('x', '-8px')
            .attr('y', '-5px')
            .attr('text-anchor', 'end')
            .attr('transform', 'rotate(-90)')

  titulo.transition()
        .duration(2000)
        .attr('x', `${ancho / 2}px`)
        .attr('y', '-5px')
        .attr('text-anchor', 'middle')
        .text(function(n)
          {
              varTexto=''
              console.log(metrica)
              console.log(maxy)
              if(metrica=='TotalDeaths')
                varTexto='Muertes Acumuladas: '+maxy
              if(metrica=='NewDeaths')
                varTexto='Muertes Diarias - Record: '+maxy
              if(metrica=='TotalCases')
                varTexto='Casos Acumulados: '+maxy
              if(metrica=='NewCases')
                varTexto='Casos Diarios - Record: '+maxy                                
              return varTexto
           })
        .attr('class', 'titulo-grafica') 
  

}
/*****/

/***** Carga del Dataset *****/
d3.csv('dataset/covid19Mexico.csv')
  .then(function(data) 
  {
    /***** Ciclo de todos los registros *****/
    data.forEach(d => 
      {
        /***** Convertir a numercos *****/
        d.Population = +d.Population
        d.NewCases = +d.NewCases
        d.TotalCases = +d.TotalCases
        d.NewDeaths = +d.NewDeaths
        d.TotalDeaths = +d.TotalDeaths
        /*****/
        /***** Llenar arreglo valoresTickX solo con los dias primero de cada mes *****/
        varDia = d.date.split("/")
        //console.log(varDia)
        if(varDia[1] == '1' )
        {
          //console.log("Entro")
          valoresTickX.push(d.date)
          //console.log(valoresTickX)
        }
        /*****/
        
      })
    /*****/
    // Asigna data a Variable Global para ser usada en otras funciones 
    dataArray = data
    frame()
  })
/*****/

/***** Funcion para calcular los dominios dependiendo de la metrica a usar */  
function frame() 
{
  dataframe = dataArray 
  // Calcular la altura más alta dentro de los datos de la metrica seleccionada
  maxy = d3.max(dataframe, d => d[metrica])
  //Definimos el dominio de X y Y
  y.domain([0, maxy])
  x.domain(dataframe.map(d => d.date))
  render(dataframe)
}
    
/***** Se ejecuta cuando cambia el select box *****/
metricaSelect.on('change', () => 
{
  metrica = metricaSelect.node().value
  frame()
})
/*****/
    
 

