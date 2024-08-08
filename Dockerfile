FROM php:apache
RUN a2enmod headers
RUN docker-php-ext-install mysqli