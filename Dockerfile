FROM php:apache
RUN a2enmod headers
RUN docker-php-ext-install mysqli

# Copy your custom Apache configuration file into the container
COPY custom.conf /etc/apache2/conf-available/custom.conf

# Enable the custom configuration
RUN a2enconf custom

# Expose port 80
EXPOSE 80