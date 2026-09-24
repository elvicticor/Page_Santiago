-- Inserta exactamente 500 votos sintéticos: 25 por cada una de las 20 categorías.
-- Se pueden borrar sin afectar votos reales con:
-- delete from public.votes where is_demo = true;

alter table public.votes add column if not exists is_demo boolean not null default false;

delete from public.votes where is_demo = true;

with nominee_pool(category, nominees) as (
    values
    ('Artista del año', array['Samuel García','Valentina Ríos','Daniel Calveti','Sara Moreno','Andrés Cepeda Worship','Lucía Fernández','Mateo Cruz','Camila Torres','David Salazar','Rebeca López']),
    ('Canción del año', array['Gracia Infinita','Vuelvo a Ti','Luz en el Camino','Tu Fidelidad','Cielo Abierto','Eres Mi Hogar','Nada Me Faltará','En Tu Presencia','Milagro de Amor','Todo Es Posible']),
    ('Álbum del año', array['Renacer','Casa de Adoración','Más Cerca','Eterno','Raíces','Sin Límites','Voces del Reino','Paz en la Tormenta','Altar','Todo Nuevo']),
    ('Artista revelación', array['Elías Romero','Mariana Vélez','Santiago León','Isa Beltrán','Josué Díaz','Mía Castillo','Nicolás Pardo','Emma Vargas','Felipe Suárez','Ana Sofía Gil']),
    ('Mejor artista femenina', array['Valentina Ríos','Sara Moreno','Lucía Fernández','Camila Torres','Rebeca López','Mariana Vélez','Isa Beltrán','Mía Castillo','Emma Vargas','Ana Sofía Gil']),
    ('Mejor artista masculino', array['Samuel García','Daniel Calveti','Mateo Cruz','David Salazar','Elías Romero','Santiago León','Josué Díaz','Nicolás Pardo','Felipe Suárez','Pablo Reyes']),
    ('Mejor banda o grupo', array['Voces del Reino','Conexión Cielo','Adoración Central','Ruta 7','Gracia Viva','Nación Santa','Fuego & Luz','Casa Worship','Aliento','Generación Uno']),
    ('Mejor canción de adoración', array['En Tu Presencia','Santo Por Siempre','Aquí Estoy','Mi Refugio','Digno','A Tus Pies','Altar','Te Contemplo','Gloria Eterna','Cerca de Ti']),
    ('Mejor canción urbana', array['Sin Miedo','Código de Gracia','Otra Vida','Libre Soy','Flow del Reino','En la Calle','Mi Identidad','Luz Neón','Firmes','Voy Contigo']),
    ('Mejor canción pop', array['Vuelvo a Ti','Todo Es Posible','Eres Mi Hogar','Brillar','Amanecer','Contigo','Latidos','Por Siempre','Tu Voz','Un Día Más']),
    ('Mejor canción tropical', array['Fiesta en el Cielo','Gozo','Baila Mi Alma','Celebraré','Ritmo de Fe','Alegría','Vivo Para Ti','Día de Victoria','Canto Libre','Suena la Esperanza']),
    ('Mejor colaboración', array['Juntos Otra Vez','Somos Uno','Cielo Abierto','Tu Amor Nos Une','Un Mismo Corazón','Más Allá','Voces de Esperanza','Contigo Voy','La Promesa','Reino y Poder']),
    ('Mejor video musical', array['Luz en el Camino','Renacer','Sin Miedo','Cielo Abierto','Altar','Brillar','Mi Refugio','Somos Uno','Raíces','Amanecer']),
    ('Mejor producción musical', array['Renacer — Samuel García','Eterno — Sara Moreno','Casa de Adoración — Voces del Reino','Más Cerca — Valentina Ríos','Raíces — David Salazar','Sin Límites — Conexión Cielo','Altar — Lucía Fernández','Todo Nuevo — Mateo Cruz','Paz en la Tormenta — Camila Torres','Gracia Viva — Gracia Viva']),
    ('Mejor productor', array['Alejandro Mesa','Juan Pablo Ríos','Marcos Téllez','Laura Jiménez','Esteban Duarte','Felipe Acosta','Daniel Mora','Sofía Cárdenas','Miguel Ángel Ruiz','Carlos Beltrán']),
    ('Mejor compositor', array['Sara Moreno','Samuel García','Valentina Ríos','David Salazar','Lucía Fernández','Mateo Cruz','Mariana Vélez','Josué Díaz','Camila Torres','Santiago León']),
    ('Mejor álbum en vivo', array['Noche de Gloria','En Casa: En Vivo','Cielo Abierto Live','Voces Unidas','Altar Vivo','Encuentro','Más Cerca Live','Un Solo Corazón','Santo: La Noche','Bogotá Adora']),
    ('Mejor podcast cristiano', array['Café con Propósito','Fe Cotidiana','Más Profundo','Conversaciones de Gracia','La Mesa','Preguntas del Alma','Vivir con Propósito','Entre Amigos','Pausa y Fe','Historias de Esperanza']),
    ('Libro cristiano del año', array['Fe para Hoy','El Camino de Regreso','Gracia Cotidiana','Una Vida con Propósito','Después de la Tormenta','Cartas al Corazón','Raíces de Esperanza','Silencio y Presencia','El Arte de Perdonar','Liderar Sirviendo']),
    ('Premio del público', array['Samuel García','Valentina Ríos','Voces del Reino','Sara Moreno','Conexión Cielo','David Salazar','Lucía Fernández','Mateo Cruz','Camila Torres','Gracia Viva'])
)
insert into public.votes (ballot_id, category, nominee, is_demo)
select
    gen_random_uuid(),
    pool.category,
    pool.nominees[1 + floor(random() * array_length(pool.nominees, 1))::int],
    true
from nominee_pool pool
cross join generate_series(1, 25);

select count(*) as votos_demo_insertados
from public.votes
where is_demo = true;
