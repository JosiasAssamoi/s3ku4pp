import { ApolloServer, gql } from "apollo-server"
import { PrismaClient } from '@prisma/client'



async function main(): Promise<void> {

  const prisma = new PrismaClient()

  const typeDefs = gql`
  type User {
    email : String
    password : String
  }

  type Query {
    getOneUser : User
    getOneQuizz(id: Int!) : Quizz
    validateAnswer(answerId : Int!) : Boolean
  }

  type Quizz {
    id : String
    name : String
    questions: [Question]
  }

  type Question {
    id : String
    content : String
    quizz : Quizz
    answers : [Answer]
  }

  type Answer {
    id : Int    
    content : String
    question : Question 
    correct : Boolean
  }

  `

  const resolvers = {
    Query: {
      getOneUser: (_, { email }) => {
        return prisma.user.findUnique({
          where: {
            email: email
          }
        })
      },
      getOneQuizz: (_, { id }) => {

        return prisma.quizz.findUnique({
          where: {
            id
          },
          include: {
            questions: {
              include: {
                answers: {
                  select: {
                    correct: false,
                    id: true,
                    content: true
                  }
                }
              }
            }
          }
        })
      },
      validateAnswer: async (_, { answerId }) => {
        const answer = await prisma.answer.findFirst({
          where: {
            id: answerId
          }
        }
        )
        return answer ? answer.correct : false
      }
    }
  }

  const server = new ApolloServer({
    typeDefs,
    resolvers
  })

  const { url } = await server.listen()
  console.log(`Server ready at ${url}`)
}

// Entrypoint
main()
