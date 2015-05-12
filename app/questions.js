define(function() {
  return [
    {
      "name": "Client/User Environment",
      "children": [
        {
          "name": "Interent vs. Intranet",
          "explanation": "Intranet applications are used by a smaller group of users typically within a company (sometimes including vendors) distributed in geographical clusters. Intranet applications mostly will only be accessible from within an office network. Internet applications cater to a much wider audience which may be distributed.",
          "implication": "Intranet applications cater to a captive audience whose day-to-day operation requires interaction with the application and hence will be more patient and tolerant of poor performance and experience. The internet users have a shorter attention span and hence the performance and experience needs to be fast and slick. Applications hosted on the internet are more suceptible to be target for malicious attacks and hence need to be protected more rigorously."
        },
        {
          "name": "Channel Coverage",
          "explanation": "What are the primary channels that will be used to access the application.",
          "implication": "Decides what should be the focus mobile-first vs. web-first. Influences all aspects of the application from UI, UX and application design. Performance characteristics for handheld devices will be lower compared to desktops/laptops."
        },
        {
          "name": "Connectivity",
          "explanation": "Connectivity of the application to the device that will be using the application. Desktops/laptops might connect through LAN/WiFi but, handheld devices might connect through WiFi or low-bandwidth EDGE/2G/3G connections",
          "implication": "Connectivity determines the performance of the application. Applications that have to operate in poor connectivity environments can benefit from an offline first apporach to development. Testing the application in low-bandwidth connections can yield critical insights to optimizing application performance"
        }
      ]
    },
    {
      "name": "User Interface",
      "children": [
        {
          "name": "Standard vs. Custom UI elements",
          "explanation": "HTML offers a standard set of form elements like the textbox, selectbox, file upload and textarea. These might not suit the needs for various data formats. Eg. Dates, credit cards etc.",
          "implication": "Traditional UI elements offered by HTML do not provide a rich user experiene. Widget and component libraries can augment the existing set of elements to provide a richer experience. But, such components can be difficult to integrate and might not play well with other libraries."
        },
        {
          "name": "Data Push to clients",
          "explanation": "Client server systems typically operate on the pull model where the client pulls the data from the server when required. But, in some cases information needs to be pushed from the server to the client for eg. Notifications to the user",
          "implication": "Push technology to handhelds is built-in in all mobile OS platforms but, desktop support has not gathered traction yet. Suitable alternatives have to be considered when push to the client is not supported."
        },
        {
          "name": "Handle large number of data elements",
          "explanation": "Number of UI elements present on the screen at any point in time. Certain screens may contain more than some others. For eg. Reporting screens might contain more elements displayed than data capture screens.",
          "implication": "The memory consumption and the UI responsiveness will be impacted by the number of elements on the page. Some libraries like ReactJS optimize the DOM transformations by applying only the differences instead of recreating the entire DOM tree thus providing better responsiveness and limiting memory overruns."
        },
        {
          "name": "Validation support",
          "explanation": "Validations fall broadly into 2 categories user input validation and model/business validations. User input validation is typically duplicated on client and server as the client requests can easily be tampered.",
          "implication": "Moving away from a form based validation approach will lead to primarily model validation which can be more consistent across the client and the server. Similar to ORMs on the server-side OIMs (Object Interface Mappers) can be used to generate the templates and model validations both on the client and server."
        },
        {
          "name": "UI metaphors",
          "explanation": "MVC is a common metaphor that is available both on the client-side and server-side development",
          "implication": "There are several flavors of MV*"
        }
      ]
    },
    {
      "name": "Server Environment",
      "children": [
        {
          "name": "Green vs. Brown field",
          "explanation": "If there is an existing application that will be modernized. Then reuse of atleast some of it components becomes an important factor in choosing a framework.",
          "implication": "When resuing existing components there might be some additional effort required to refactor/generate the target code. In case of some frameworks like GWT which is in itself a code-generation based framework very little of the application code can be reused."
        },
        {
          "name": "Service Interfaces",
          "explanation": "In case of existing applications there might already exist web service endpoints which can be utilized by the modernization. In new development most frameworks tend to work well with JSON based REST services.",
          "implication": "When existing interfaces are reused we might be incurring some technical debt because of the dated interfaces which may need replacement for future development."
        },
        {
          "name": "Isomorphism",
          "explanation": "Isomorphism is the ability to run the same code on the client and the server. Since the introduction of NodeJS in 2009 isomorphic javascript applications have become a reality.",
          "implication": "Isomorphism allows better reuse of some aspects of the application. But, as a concept it is fairly new and most frameworks in this area are in their nascent stages of development. Isomorphic frameworks are very suited to build realtime interactive applications."
        }
      ]
    },
    {
      "name": "Developer Support",
      "children": [
        {
          "name": "Knowledge of working with Open Source Communities",
          "explanation": "Due to the nature of interpreting javascript on the browsers, all SPAs are open source there are very few commercially licensed frameworks.",
          "implication": "Open source communities operate differently from companies which are promoting a framework. In some cases there might not be a commercial entity to provide support. In such cases experience in interacting with opensource communities will be required to fix bugs and add new features to the framework."
        },
        {
          "name": "Level of familiarity with Javascript",
          "explanation": "Javascript is the language of the web, based on the ECMA script standard has which was dormant for some time has since 2010 been introducing new features and updating the language for the needs of modern web development.",
          "implication": "Javascript as a language has several quirks and adding to the fact that it has to run consistently across different browser implemntations is a challenging task. Having more experienced javascript developers means that more advanced frameworks can be chosen."
        },
        {
          "name": "Tooling requirements",
          "explanation": "The ecosystem for front-end web development has exploded there are multiple languages, different versions of standards and different browser implementations. The need for tools to handle dependencies, package management and distribution has fueled the creation of a plethora of tools",
          "implication": "The abundance of tools each with its own feature-set poses a challenge in the selection of appropriate tools both to improve development and simplify deployment."
        }
      ]
    },
    {
      "name": "Application Needs",
      "children": [
        {
          "name": "Codebase Size",
          "explanation": "The estimated size of the application in terms of the number of screens and the possible functionalities can be a good indicator of the complexity of the application. The more complex the application the more it needs to be simplified in terms of breaking up of functionality into smaller components.",
          "implication": "If the choice of framework imposes a structure on organizing the codebase it is easier for new developers to quickly become productive. Otherwise they might have to spend more time getting familiar with a large codebase."
        },
        {
          "name": "Complexity of entities",
          "explanation": "Every application is unique and the underlying domain models will vary. OOP principles such as abstraction, composition and inheritance have to be used.",
          "implication": "Translating existing server-side models to the client-side might in some cases be counter-productive as the interactions that are possible on the client and server are vastly different. Model design might be dictated by some frameworks but, in cases where it is not careful consideration to the design of the models must be made."
        },
        {
          "name": "SEO support",
          "explanation": "Applications open to the internet will require the application to be crawlable by search spiders so that the application will figure prominently in search results",
          "implication": "Templates rendering in SPAs happens on the browser and hence search engine crawlers which cannot evaluate javascript might not be able to index the application. SPAs also use a lot of the browser specific features such as history manipulation and hash urls so, any web crawlers which cannot handle them cannot index the application."
        },
        {
          "name": "Modularity",
          "explanation": "Developing and maintaining a large monolithic codebase is cumbersome. So, the ability to break up functionality into modules allows the application to have a coherent structure and streamlines development and maintenance.",
          "implication": "Decomposition of modules can be done several ways and sometimes frameworks themselves dictate how modules and code should be structured. Dependency management and on-demand loading (lazy loading) of modules will be required for large applications to improve performance and memory consumption on the browser."
        },
        {
          "name": "Embeddability",
          "explanation": "Applications might be part of a suite of applications or a set of enterpriser intranet applications and such requirements may impose additional constraints on framework selection.",
          "implication": "Since SPA frameworks rely on history and url manipulation they might have some constraints working in a portal environment or running within frames etc."
        },
        {
          "name": "Offline needs",
          "explanation": "In case of applications that have to operate in intermittent connectivity environments the data and user experience has to be consistent both while online and offline.",
          "implication": "Careful consideration is required to decide which features can be provided offline and how to gracefully degrade the application functionality while offline. Sensitive data might have to be stored in some cases which poses additional challenges."
        },
        {
          "name": "Performance",
          "explanation": "Performance has different aspects to it most important for application users is the perceived performance",
          "implication": "First page load, interface responsiveness, server responsiveness"
        }
      ]
    }
  ]
});
