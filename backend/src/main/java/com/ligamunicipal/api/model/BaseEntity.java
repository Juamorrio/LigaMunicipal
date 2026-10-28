package com.ligamunicipal.api.model;
import jakarta.persistence.*; import java.time.Instant; import java.util.UUID;
@MappedSuperclass public abstract class BaseEntity { @Id @GeneratedValue(strategy=GenerationType.UUID) public UUID id; @Column(nullable=false) public Instant fechaCreacion=Instant.now(); }
