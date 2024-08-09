# Use the official PHP image with Apache
FROM php:apache

# Enable necessary Apache modules
RUN a2enmod headers rewrite

# Install PHP extensions
RUN docker-php-ext-install mysqli

# Expose port 80
EXPOSE 80