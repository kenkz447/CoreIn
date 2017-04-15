﻿using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using CoreIn.Commons;

namespace CoreIn.Commons.Migrations
{
    [DbContext(typeof(CoreInDbContext))]
    partial class CoreInDbContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
            modelBuilder
                .HasAnnotation("ProductVersion", "1.1.1")
                .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            modelBuilder.Entity("CoreIn.Models.Authentication.Role", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("ConcurrencyStamp")
                        .IsConcurrencyToken();

                    b.Property<string>("Name")
                        .HasMaxLength(256);

                    b.Property<string>("NormalizedName")
                        .HasMaxLength(256);

                    b.HasKey("Id");

                    b.HasIndex("NormalizedName")
                        .IsUnique()
                        .HasName("RoleNameIndex");

                    b.ToTable("AspNetRoles");
                });

            modelBuilder.Entity("CoreIn.Models.Authentication.User", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<int>("AccessFailedCount");

                    b.Property<string>("ConcurrencyStamp")
                        .IsConcurrencyToken();

                    b.Property<long?>("CreateBy");

                    b.Property<DateTime?>("CreatedOn");

                    b.Property<string>("Email")
                        .HasMaxLength(256);

                    b.Property<bool>("EmailConfirmed");

                    b.Property<bool>("LockoutEnabled");

                    b.Property<DateTimeOffset?>("LockoutEnd");

                    b.Property<string>("NormalizedEmail")
                        .HasMaxLength(256);

                    b.Property<string>("NormalizedUserName")
                        .HasMaxLength(256);

                    b.Property<string>("PasswordHash");

                    b.Property<string>("PhoneNumber");

                    b.Property<bool>("PhoneNumberConfirmed");

                    b.Property<string>("SecurityStamp");

                    b.Property<bool>("TwoFactorEnabled");

                    b.Property<long?>("UpdateBy");

                    b.Property<DateTime?>("UpdatedOn");

                    b.Property<string>("UserName")
                        .HasMaxLength(256);

                    b.HasKey("Id");

                    b.HasIndex("CreateBy");

                    b.HasIndex("NormalizedEmail")
                        .HasName("EmailIndex");

                    b.HasIndex("NormalizedUserName")
                        .IsUnique()
                        .HasName("UserNameIndex");

                    b.HasIndex("UpdateBy");

                    b.ToTable("AspNetUsers");
                });

            modelBuilder.Entity("CoreIn.Models.EntityType", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTime?>("Created");

                    b.Property<long?>("EntityTypeId");

                    b.Property<string>("Name");

                    b.Property<long?>("OwnerId");

                    b.Property<long?>("ParentId");

                    b.HasKey("Id");

                    b.HasIndex("EntityTypeId");

                    b.HasIndex("OwnerId");

                    b.ToTable("CoreIn_EntityType");
                });

            modelBuilder.Entity("CoreIn.Models.EntityTypeDetail", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<long>("EntityId");

                    b.Property<string>("Field");

                    b.Property<DateTime?>("Modified");

                    b.Property<long?>("ModifiedById");

                    b.Property<string>("Value");

                    b.HasKey("Id");

                    b.HasIndex("EntityId");

                    b.HasIndex("ModifiedById");

                    b.ToTable("CoreIn_EntityTypeDetail");
                });

            modelBuilder.Entity("CoreIn.Models.FileEntity", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTime?>("Created");

                    b.Property<long?>("EntityTypeId");

                    b.Property<long?>("FileEntityId");

                    b.Property<string>("Name");

                    b.Property<long?>("OwnerId");

                    b.Property<long?>("ParentId");

                    b.HasKey("Id");

                    b.HasIndex("EntityTypeId");

                    b.HasIndex("FileEntityId");

                    b.HasIndex("OwnerId");

                    b.ToTable("CoreIn_FileEntity");
                });

            modelBuilder.Entity("CoreIn.Models.FileEntityDetail", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<long>("EntityId");

                    b.Property<string>("Field");

                    b.Property<DateTime?>("Modified");

                    b.Property<long?>("ModifiedById");

                    b.Property<string>("Value");

                    b.HasKey("Id");

                    b.HasIndex("EntityId");

                    b.HasIndex("ModifiedById");

                    b.ToTable("CoreIn_FileEntityDetail");
                });

            modelBuilder.Entity("CoreIn.Models.FileEntityInTaxonomy", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<long>("FileEntityId");

                    b.Property<long>("TaxonomyId");

                    b.HasKey("Id");

                    b.HasIndex("FileEntityId");

                    b.HasIndex("TaxonomyId");

                    b.ToTable("CoreIn_FileEntityInTaxonomy");
                });

            modelBuilder.Entity("CoreIn.Models.Menu", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTime?>("Created");

                    b.Property<long?>("EntityTypeId");

                    b.Property<string>("Name");

                    b.Property<long?>("OwnerId");

                    b.Property<long?>("ParentId");

                    b.HasKey("Id");

                    b.HasIndex("EntityTypeId");

                    b.HasIndex("OwnerId");

                    b.HasIndex("ParentId");

                    b.ToTable("CoreIn_Menu");
                });

            modelBuilder.Entity("CoreIn.Models.MenuDetail", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<long>("EntityId");

                    b.Property<string>("Field");

                    b.Property<DateTime?>("Modified");

                    b.Property<long?>("ModifiedById");

                    b.Property<string>("Value");

                    b.HasKey("Id");

                    b.HasIndex("EntityId");

                    b.HasIndex("ModifiedById");

                    b.ToTable("CoreIn_MenuDetail");
                });

            modelBuilder.Entity("CoreIn.Models.Taxonomy", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTime?>("Created");

                    b.Property<long?>("EntityTypeId");

                    b.Property<string>("Name");

                    b.Property<long?>("OwnerId");

                    b.Property<long?>("ParentId");

                    b.Property<long>("TaxonomyTypeId");

                    b.HasKey("Id");

                    b.HasIndex("EntityTypeId");

                    b.HasIndex("OwnerId");

                    b.HasIndex("ParentId");

                    b.HasIndex("TaxonomyTypeId");

                    b.ToTable("CoreIn_Taxonomy");
                });

            modelBuilder.Entity("CoreIn.Models.TaxonomyDetail", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<long>("EntityId");

                    b.Property<string>("Field");

                    b.Property<DateTime?>("Modified");

                    b.Property<long?>("ModifiedById");

                    b.Property<string>("Value");

                    b.HasKey("Id");

                    b.HasIndex("EntityId");

                    b.HasIndex("ModifiedById");

                    b.ToTable("CoreIn_TaxonomyDetail");
                });

            modelBuilder.Entity("CoreIn.Models.TaxonomyType", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTime?>("Created");

                    b.Property<long?>("EntityTypeId");

                    b.Property<string>("Name");

                    b.Property<long?>("OwnerId");

                    b.Property<long?>("ParentId");

                    b.Property<long?>("TaxonomyTypeId");

                    b.HasKey("Id");

                    b.HasIndex("EntityTypeId");

                    b.HasIndex("OwnerId");

                    b.HasIndex("TaxonomyTypeId");

                    b.ToTable("CoreIn_TaxonomyType");
                });

            modelBuilder.Entity("CoreIn.Models.TaxonomyTypeDetail", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<long>("EntityId");

                    b.Property<string>("Field");

                    b.Property<DateTime?>("Modified");

                    b.Property<long?>("ModifiedById");

                    b.Property<string>("Value");

                    b.HasKey("Id");

                    b.HasIndex("EntityId");

                    b.HasIndex("ModifiedById");

                    b.ToTable("CoreIn_TaxonomyTypeDetail");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.EntityFrameworkCore.IdentityRoleClaim<long>", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("ClaimType");

                    b.Property<string>("ClaimValue");

                    b.Property<long>("RoleId");

                    b.HasKey("Id");

                    b.HasIndex("RoleId");

                    b.ToTable("AspNetRoleClaims");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.EntityFrameworkCore.IdentityUserClaim<long>", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("ClaimType");

                    b.Property<string>("ClaimValue");

                    b.Property<long>("UserId");

                    b.HasKey("Id");

                    b.HasIndex("UserId");

                    b.ToTable("AspNetUserClaims");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.EntityFrameworkCore.IdentityUserLogin<long>", b =>
                {
                    b.Property<string>("LoginProvider");

                    b.Property<string>("ProviderKey");

                    b.Property<string>("ProviderDisplayName");

                    b.Property<long>("UserId");

                    b.HasKey("LoginProvider", "ProviderKey");

                    b.HasIndex("UserId");

                    b.ToTable("AspNetUserLogins");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.EntityFrameworkCore.IdentityUserRole<long>", b =>
                {
                    b.Property<long>("UserId");

                    b.Property<long>("RoleId");

                    b.HasKey("UserId", "RoleId");

                    b.HasIndex("RoleId");

                    b.ToTable("AspNetUserRoles");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.EntityFrameworkCore.IdentityUserToken<long>", b =>
                {
                    b.Property<long>("UserId");

                    b.Property<string>("LoginProvider");

                    b.Property<string>("Name");

                    b.Property<string>("Value");

                    b.HasKey("UserId", "LoginProvider", "Name");

                    b.ToTable("AspNetUserTokens");
                });

            modelBuilder.Entity("CoreIn.Models.Authentication.User", b =>
                {
                    b.HasOne("CoreIn.Models.Authentication.User", "CreateByUser")
                        .WithMany()
                        .HasForeignKey("CreateBy");

                    b.HasOne("CoreIn.Models.Authentication.User", "UpdateByUser")
                        .WithMany()
                        .HasForeignKey("UpdateBy");
                });

            modelBuilder.Entity("CoreIn.Models.EntityType", b =>
                {
                    b.HasOne("CoreIn.Models.EntityType", "EntityType")
                        .WithMany()
                        .HasForeignKey("EntityTypeId");

                    b.HasOne("CoreIn.Models.Authentication.User", "Owner")
                        .WithMany()
                        .HasForeignKey("OwnerId");
                });

            modelBuilder.Entity("CoreIn.Models.EntityTypeDetail", b =>
                {
                    b.HasOne("CoreIn.Models.EntityType", "Entity")
                        .WithMany("Details")
                        .HasForeignKey("EntityId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("CoreIn.Models.Authentication.User", "ModifiedBy")
                        .WithMany()
                        .HasForeignKey("ModifiedById");
                });

            modelBuilder.Entity("CoreIn.Models.FileEntity", b =>
                {
                    b.HasOne("CoreIn.Models.EntityType", "EntityType")
                        .WithMany()
                        .HasForeignKey("EntityTypeId");

                    b.HasOne("CoreIn.Models.FileEntity")
                        .WithMany("Children")
                        .HasForeignKey("FileEntityId");

                    b.HasOne("CoreIn.Models.Authentication.User", "Owner")
                        .WithMany()
                        .HasForeignKey("OwnerId");
                });

            modelBuilder.Entity("CoreIn.Models.FileEntityDetail", b =>
                {
                    b.HasOne("CoreIn.Models.FileEntity", "Entity")
                        .WithMany("Details")
                        .HasForeignKey("EntityId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("CoreIn.Models.Authentication.User", "ModifiedBy")
                        .WithMany()
                        .HasForeignKey("ModifiedById");
                });

            modelBuilder.Entity("CoreIn.Models.FileEntityInTaxonomy", b =>
                {
                    b.HasOne("CoreIn.Models.FileEntity", "FileEntity")
                        .WithMany("Taxonomies")
                        .HasForeignKey("FileEntityId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("CoreIn.Models.Taxonomy", "Taxonomy")
                        .WithMany()
                        .HasForeignKey("TaxonomyId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("CoreIn.Models.Menu", b =>
                {
                    b.HasOne("CoreIn.Models.EntityType", "EntityType")
                        .WithMany()
                        .HasForeignKey("EntityTypeId");

                    b.HasOne("CoreIn.Models.Authentication.User", "Owner")
                        .WithMany()
                        .HasForeignKey("OwnerId");

                    b.HasOne("CoreIn.Models.Menu", "Parent")
                        .WithMany("Children")
                        .HasForeignKey("ParentId");
                });

            modelBuilder.Entity("CoreIn.Models.MenuDetail", b =>
                {
                    b.HasOne("CoreIn.Models.Menu", "Menu")
                        .WithMany("Details")
                        .HasForeignKey("EntityId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("CoreIn.Models.Authentication.User", "ModifiedBy")
                        .WithMany()
                        .HasForeignKey("ModifiedById");
                });

            modelBuilder.Entity("CoreIn.Models.Taxonomy", b =>
                {
                    b.HasOne("CoreIn.Models.EntityType", "EntityType")
                        .WithMany()
                        .HasForeignKey("EntityTypeId");

                    b.HasOne("CoreIn.Models.Authentication.User", "Owner")
                        .WithMany()
                        .HasForeignKey("OwnerId");

                    b.HasOne("CoreIn.Models.Taxonomy", "Parent")
                        .WithMany("Children")
                        .HasForeignKey("ParentId");

                    b.HasOne("CoreIn.Models.TaxonomyType", "TaxonomyType")
                        .WithMany("Taxonomies")
                        .HasForeignKey("TaxonomyTypeId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("CoreIn.Models.TaxonomyDetail", b =>
                {
                    b.HasOne("CoreIn.Models.Taxonomy", "Entity")
                        .WithMany("Details")
                        .HasForeignKey("EntityId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("CoreIn.Models.Authentication.User", "ModifiedBy")
                        .WithMany()
                        .HasForeignKey("ModifiedById");
                });

            modelBuilder.Entity("CoreIn.Models.TaxonomyType", b =>
                {
                    b.HasOne("CoreIn.Models.EntityType", "EntityType")
                        .WithMany()
                        .HasForeignKey("EntityTypeId");

                    b.HasOne("CoreIn.Models.Authentication.User", "Owner")
                        .WithMany()
                        .HasForeignKey("OwnerId");

                    b.HasOne("CoreIn.Models.TaxonomyType")
                        .WithMany("Children")
                        .HasForeignKey("TaxonomyTypeId");
                });

            modelBuilder.Entity("CoreIn.Models.TaxonomyTypeDetail", b =>
                {
                    b.HasOne("CoreIn.Models.TaxonomyType", "Entity")
                        .WithMany("Details")
                        .HasForeignKey("EntityId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("CoreIn.Models.Authentication.User", "ModifiedBy")
                        .WithMany()
                        .HasForeignKey("ModifiedById");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.EntityFrameworkCore.IdentityRoleClaim<long>", b =>
                {
                    b.HasOne("CoreIn.Models.Authentication.Role")
                        .WithMany("Claims")
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.EntityFrameworkCore.IdentityUserClaim<long>", b =>
                {
                    b.HasOne("CoreIn.Models.Authentication.User")
                        .WithMany("Claims")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.EntityFrameworkCore.IdentityUserLogin<long>", b =>
                {
                    b.HasOne("CoreIn.Models.Authentication.User")
                        .WithMany("Logins")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.EntityFrameworkCore.IdentityUserRole<long>", b =>
                {
                    b.HasOne("CoreIn.Models.Authentication.Role")
                        .WithMany("Users")
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("CoreIn.Models.Authentication.User")
                        .WithMany("Roles")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade);
                });
        }
    }
}
