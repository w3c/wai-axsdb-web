for ( var property in accessdb.config.services)
{
    accessdb.config.services[property] = accessdb.config.URL_API_ROOT + accessdb.config.services[property];
}