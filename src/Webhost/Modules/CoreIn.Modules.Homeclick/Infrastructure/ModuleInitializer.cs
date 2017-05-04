using System.Collections.Generic;
using Microsoft.Extensions.DependencyInjection;
using CoreIn.Modular.Infrastructure;
using CoreIn.Commons;
using CoreIn.Models;
using CoreIn.Models.Authentication;
using CoreIn.Resources.ConstantKeys;
using Microsoft.AspNetCore.Identity;
using CoreIn.EntityCore;

namespace CoreIn.Modules.Homeclick
{
    public class ModularInitializer : IModuleInitializer
    {
        private void InitDatabase(UserManager<User> userManager, IMenuHelper menuHelper)
        {
            var supperUser = userManager.FindByNameAsync(AppKey.SupperAdminUserName).Result;
            var appMenu = menuHelper.Menu(AppKey.AppMenuName);

            menuHelper.CreateMenuEntity(
                new Menu {
                    Name = "homeclick",
                    Parent = appMenu,
                    Children = new List<Menu>
                    {
                        menuHelper.CreateMenuEntity(
                            new Menu {
                                Name = "project",
                                Children = new List<Menu>
                                {
                                     menuHelper.CreateMenuEntity(
                                        new Menu
                                        {
                                            Name = "project-index",
                                        },
                                        new MenuDetail[]
                                        {
                                            new MenuDetail { Field = "title", Value = "All projects", Language="en-US"},
                                            new MenuDetail { Field = "title", Value = "Tất cả dự Án", Language="vi-VN"},
                                            new MenuDetail { Field = "controller", Value = "project"},
                                            new MenuDetail { Field = "action", Value = "index"},
                                            new MenuDetail { Field = "url", Value = "/project"},
                                            new MenuDetail { Field = "icon", Value = "<i class=\"fa fa-bars\" aria-hidden=\"true\"></i>"},
                                        },
                                        supperUser, false
                                    ),
                                    menuHelper.CreateMenuEntity(
                                        new Menu
                                        {
                                            Name = "project-new",
                                        },
                                        new MenuDetail[]
                                        {
                                            new MenuDetail { Field = "title", Value = "New project", Language="en-US"},
                                            new MenuDetail { Field = "title", Value = "Thêm dự án mới", Language="vi-VN"},
                                            new MenuDetail { Field = "controller", Value = "project"},
                                            new MenuDetail { Field = "action", Value = "create"},
                                            new MenuDetail { Field = "url", Value = "/project/create"},
                                            new MenuDetail { Field = "icon", Value = "<i class=\"fa fa-plus\" aria-hidden=\"true\"></i>"},
                                        },
                                        supperUser, false
                                    )
                                }
                            },
                            new MenuDetail[]
                            {
                                new MenuDetail { Field = "title", Value = "Project", Language="en-US"},
                                new MenuDetail { Field = "title", Value = "Dự Án", Language="vi-VN"},
                                new MenuDetail { Field = "url", Value = "#"},
                                new MenuDetail { Field = "icon", Value = "<i class=\"fa fa-building-o\" aria-hidden=\"true\"></i>"},
                            },
                            supperUser, false
                            )
                    }
                },
                new MenuDetail[]
                {
                    new MenuDetail { Field = "title", Value = "Homeclick"}
                }, supperUser
                );
        }

        public void Init(IServiceCollection services)
        {
            var serviceProvider = services.BuildServiceProvider();

            var userManager = serviceProvider.GetService<UserManager<User>>();
            var menuHelper = serviceProvider.GetService<IMenuHelper>();

            services.AddSingleton(new ProjectTypeManager(serviceProvider.GetService<IEntityTypeManager>(), userManager));

            services.AddSingleton(typeof(ProjectManager));

            InitDatabase(userManager, menuHelper);
        }
    }
}
