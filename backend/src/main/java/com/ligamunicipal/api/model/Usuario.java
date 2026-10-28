package com.ligamunicipal.api.model;
import com.fasterxml.jackson.annotation.JsonIgnore; import jakarta.persistence.*; import jakarta.validation.constraints.*;
@Entity @Table(name="usuarios", uniqueConstraints=@UniqueConstraint(columnNames="email")) public class Usuario extends BaseEntity { @NotBlank public String nombre; @Email @NotBlank public String email; @NotBlank @JsonIgnore public String password; public boolean administrador; public String avatarUrl; }
