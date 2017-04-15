using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using CoreIn.Models;
using CoreIn.Models.Authentication;

namespace CoreIn.Commons
{
    public class CoreInDbContext : IdentityDbContext<User, Role, long>
    {
        public CoreInDbContext(DbContextOptions<CoreInDbContext> options) : base(options)
        {

        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            var moduleManager = Configuration.ModuleManager;

            var modules = moduleManager.GetInstalledModules();

            var typeToRegisters = new List<Type>()
            {
                typeof(Menu),
                typeof(FileEntity)
            };

            foreach (var module in modules)
            {
                typeToRegisters.AddRange(module.Assembly.DefinedTypes.Select(t => t.AsType()));
            }

            modelBuilder.RegisterEntities(typeToRegisters)
                .RegisterConvention()
                .RegisterCustomMappings(typeToRegisters);

            base.OnModelCreating(modelBuilder);
        }
    }
}
