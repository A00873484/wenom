<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Register.aspx.cs" Inherits="API.Register"  %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>Register page</title>
</head>
<body>
    <form id="form1" runat="server">
    <div style="width: 213px">
        <table style="width: 425px">
            <tr>
                <td>First Name:</td>
                <td>
                    <asp:TextBox ID="tbFirstName" runat="server" ></asp:TextBox>  
                </td>
                <td>
                    <asp:RequiredFieldValidator ID="rfvFirstName" runat="server" ErrorMessage="Cannot be blank" ControlToValidate="tbFirstName">Cannot be blank</asp:RequiredFieldValidator>
                </td>
            </tr>
            <tr>
                <td>Last Name:</td>
                <td>
                    <asp:TextBox ID="tbLastName" runat="server" ></asp:TextBox>  
                </td>
                <td>
                    <asp:RequiredFieldValidator ID="rfvLastName" runat="server" ErrorMessage="Cannot be blank" ControlToValidate="tbLastName">Cannot be blank</asp:RequiredFieldValidator>
                </td>
            </tr>
            <tr>
                <td>Password:</td>
                <td>
                    <asp:TextBox ID="tbPassword" runat="server"></asp:TextBox>
                </td>
                <td>
                    <asp:RequiredFieldValidator ID="rfvPassword" runat="server" ErrorMessage="Cannot be blank" ControlToValidate="tbPassword">Cannot be blank</asp:RequiredFieldValidator>
                </td>
            </tr>
            <tr>
                <td>Email:</td>
                <td>
                    <asp:TextBox ID="tbEmail" runat="server"></asp:TextBox>
                </td>
                <td>
                    <asp:RequiredFieldValidator ID="rfvEmail" runat="server" ErrorMessage="Invalid Email" ControlToValidate="tbEmail">Invalid Email</asp:RequiredFieldValidator>
                </td>
            </tr>
        </table>
    </div>
        <p>
            <asp:Button ID="createUser" runat="server" OnClick="Button1_Click" Text="create user" />
        </p>
    </form>
</body>
</html>
