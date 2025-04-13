   import { CollectionConfig } from 'payload/types'
   
   export const Pages: CollectionConfig = {
     slug: 'pages',
     admin: {
       useAsTitle: 'title',
     },
     access: {
       read: () => true,
     },
     fields: [
       {
         name: 'title',
         type: 'text',
         required: true,
       },
       {
         name: 'slug',
         type: 'text',
         required: true,
         unique: true,
       },
       {
         name: 'content',
         type: 'richText',
         required: true,
       },
       {
         name: 'meta',
         type: 'group',
         fields: [
           {
             name: 'title',
             type: 'text',
           },
           {
             name: 'description',
             type: 'textarea',
           },
         ],
       },
     ],
   }