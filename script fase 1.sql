

create table Cliente(
id_cliente int primary key auto_increment,
nombre varchar(100) not null,
apellido varchar(100) not null,
correo varchar(200) not null,
contrasenia varchar(50) not null,
celular int,
fecha_nac date,
foto varchar(300) 
);

insert into Cliente(nombre,apellido,correo,contrasenia,celular,fecha_nac,foto) values('cliente1','perez','ejemplo@gmail.com','1234',5566,'2001-05-21','/assets/foto1');

create table Tarjeta(
id_tarjeta int primary key auto_increment,
numero int not null, 
contrasenia varchar(50) not null,
tipo varchar(100) not null,
saldo double not null,

id_cliente int not null,
foreign key(id_cliente) references Cliente(id_cliente)
);

create table Anfitrion(
id_anfitrion int primary key auto_increment,
nombre varchar(100) null,
apellido varchar(100) null,
tipo varchar(100) not null,
empresa varchar(100) null,
dpi int null,
correo varchar(200) not null,
contrasenia varchar(50) not null,
foto varchar(300) not null,
direccion varchar(300) null,
estado varchar(100) not null,
n_instancias int not null,
valoracion int not null
);

create table Propiedad(
id_propiedad int primary key auto_increment,
valor int not null,
ponderacion double,
descripcion varchar(500),
no_hab int not null,
no_camas int not null,
no_banios int not null,

id_anfitrion int not null,
foreign key(id_anfitrion) references Anfitrion(id_anfitrion)
);

create table Servicio(
id_servicio int primary key auto_increment,
nombre varchar(100),
descripcion varchar(500)
);


create table Propiedad_Servicio(
id_prop_serv int primary key auto_increment,

id_propiedad int not null,
id_servicio int not null,
foreign key(id_propiedad) references Propiedad(id_propiedad),
foreign key(id_servicio) references Servicio(id_servicio)

);


create table Foto(
id_foto int primary key auto_increment,
nombre varchar(100) not null,
direccion varchar(300) not null,

id_propiedad int not null,
foreign key(id_propiedad) references Propiedad(id_propiedad)
);


create table Reservacion(
id_reservacion int primary key auto_increment,
fecha_ini date not null,
fecha_fin date not null,
tipo varchar(100) not null,
estado varchar(100) not null,

id_cliente int not null,
id_propiedad int not null,
foreign key (id_cliente) references	Cliente(id_cliente),
foreign key (id_propiedad) references Propiedad(id_propiedad)
);

create table Resenia(
id_resenia int primary key auto_increment,
resenia double not null,
descripcion varchar(500),
limpieza int not null,
comunicacion int not null,
ubicacion int not null,
precio int not null,
seguridad int not null,

id_cliente int not null,
id_propiedad int not null,
foreign key (id_cliente) references	Cliente(id_cliente),
foreign key (id_propiedad) references Propiedad(id_propiedad)
);


ALTER USER 'root' IDENTIFIED WITH mysql_native_password BY 'secret';
flush privileges;