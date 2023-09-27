import { Button, Card, CardBody, CardHeader, Input, Link, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Tab, Tabs } from "@nextui-org/react"
import { Key, useState, useEffect } from "react"
import { RiLoginBoxLine } from "react-icons/ri"
import Form from '@/meddy/components/Form'

import { getCsrfToken, signIn } from "next-auth/react"

export default () => {
  const [ csrf, setCsrf ] = useState(""); 
  const [ selected, setSelected ] = useState<Key>("login");

  useEffect(() => {
    const getCsrf = async () => {
      setCsrf((await getCsrfToken()) as string)
    }

    getCsrf()
  }, [])

  return (
    <Card className="flex flex-col items-center justify-between p-4 text-purple-800 ring-purple-800 ring-2">
      <CardHeader className="flex flex-row items-center justify-between mx-auto">
        <RiLoginBoxLine className="w-12 h-12 mt-1" />
        <h3 className="text-xl">Please login or register your account</h3>
      </CardHeader>
        <CardBody className="flex flex-col items-center overflow-hidden">
          <Tabs
            fullWidth
            size="md"
            aria-label="Authentication form"

            selectedKey={selected}
            onSelectionChange={setSelected}

            classNames={{
              tabList: "bg-transparent",
              tab: "bg-white shadow-md",
              cursor: "shadow-lg"
            }}
          >
            <Tab key="login" title="Login">
              <form 
                className="flex flex-col gap-4" 
                
                method="POST"
                action="/api/auth/callback/credentials"
              >
                <input name="csrfToken" type="hidden" defaultValue={csrf} />
                <Input
                  isRequired
                  isClearable

                  name="email"
                  type="email"
                  placeholder="joe@example.com"

                  classNames={{
                    input: [
                      "text-purple-800"
                    ],

                    innerWrapper: "bg-transparent",
                    inputWrapper: "bg-transparent border border-purple-800 border-2",
                    errorMessage: "font-bold text-purple-900"
                  }}

                  errorMessage={"Please enter a valid email address"}
                />
                <Input
                  isRequired
                  isClearable

                  name="password"
                  type="password"

                  classNames={{
                    input: [
                      "text-purple-800"
                    ],

                    innerWrapper: "bg-transparent",
                    inputWrapper: "bg-transparent border border-purple-800 border-2",
                    errorMessage: "font-bold text-purple-900"
                  }}

                  errorMessage={"Please enter your password"}
                />
                <p className="text-center text-small">
                  Need to create an account?{" "}
                  <Link size="sm" onPress={() => setSelected("register")} className="text-purple-600 cursor-pointer ">
                    Register
                  </Link>
                </p>
                <Button 
                  className="text-purple-50 bg-purple-800"
                  size="lg"

                  type="submit"
                >
                  <span>Login</span>
                </Button>
              </form>
            </Tab>
            <Tab key="register" title="Register">
              <Form className="flex flex-col gap-4" action="/api/auth/register">
              <Input
                  isRequired
                  isClearable

                  name="name"
                  type="text"
                  placeholder="Joe Froggs"

                  classNames={{
                    input: [
                      "text-purple-800"
                    ],

                    innerWrapper: "bg-transparent",
                    inputWrapper: "bg-transparent border border-purple-800 border-2",
                    errorMessage: "font-bold text-purple-900"
                  }}

                  errorMessage={"Please enter your name"}
                />
                <Input
                  isRequired
                  isClearable

                  name="email"
                  type="email"
                  placeholder="joe@example.com"

                  classNames={{
                    input: [
                      "text-purple-800"
                    ],

                    innerWrapper: "bg-transparent",
                    inputWrapper: "bg-transparent border border-purple-800 border-2",
                    errorMessage: "font-bold text-purple-900"
                  }}

                  errorMessage={"Please enter a valid email address"}
                />
                <Input
                  isRequired
                  isClearable

                  name="password"
                  type="password"

                  classNames={{
                    input: [
                      "text-purple-800"
                    ],

                    innerWrapper: "bg-transparent",
                    inputWrapper: "bg-transparent border border-purple-800 border-2",
                    errorMessage: "font-bold text-purple-900"
                  }}

                  errorMessage={"Please enter your password"}
                />
                <p className="text-center text-small">
                  Already have an account?{" "}
                  <Link size="sm" onPress={() => setSelected("login")} className="text-purple-600 cursor-pointer">
                    Login
                  </Link>
                </p>
                <Button 
                  className="text-purple-50 bg-purple-800 mb-2"
                  size="lg"
                  type="submit"
                >
                  <span>Register</span>
                </Button>
              </Form>
            </Tab>
          </Tabs>
        </CardBody>
    </Card>
  )
}